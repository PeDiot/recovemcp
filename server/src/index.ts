import "./env.js";
import { McpServer } from "skybridge/server";
import { z } from "zod";
import { apiClient } from "./api-client.js";
import { toolDescription } from "./tool-description.js";
import { stylingInstructions } from "./styling-instructions.js";
import { sizeMappingText, sizeCategorySchema } from "./size-mapping.js";

const categoryTypeEnum = z.enum([
  "outerwear",
  "top",
  "bottom",
  "footwear",
  "accessories",
  "dress",
]);

const querySchema = z.object({
  query: z
    .string()
    .describe("FashionCLIP search query in English (≤10 words)."),
  category_type: categoryTypeEnum.describe(
    "One of [outerwear, top, bottom, footwear, accessories, dress].",
  ),
});

const filtersSchema = z.object({
  women: z
    .boolean()
    .optional()
    .describe("Set only if the user specifies gender. true for women's, false for men's. Omit if unspecified."),
  price_min: z.number().optional().describe("Minimum price filter."),
  price_max: z.number().optional().describe("Maximum price filter."),
  size: z
    .array(sizeCategorySchema)
    .optional()
    .describe(
      "Sizes to filter by, per category type. Each entry must use valid sizes for its category.",
    ),
  remove_fast_fashion: z
    .boolean()
    .optional()
    .describe("Set to true to exclude fast fashion brands."),
});

const server = new McpServer(
  { name: "recove", version: "0.0.1" },
  { capabilities: {} },
);

server.registerResource(
  "styling-instructions",
  "resource:///styling-instructions",
  {
    description:
      "Fashion Art Director persona, style cheat sheet (Y2K, Parisian, Cottagecore, Quiet Luxury, etc.) with priority brands, and search workflow rules. READ THIS before calling search-recove whenever the user mentions a style, era, aesthetic, vibe, or requests an outfit/look.",
    mimeType: "text/plain",
  },
  () => ({
    contents: [
      {
        uri: "resource:///styling-instructions",
        text: stylingInstructions,
      },
    ],
  }),
);

server.registerResource(
  "size-mapping",
  "resource:///size-mapping",
  {
    description:
      "Valid size values per category type (outerwear, top, bottom, dress, footwear) for the filters.size parameter. READ THIS before calling search-recove whenever the user mentions a size (e.g. 'M', '38', 'taille 42'), so the filter entries use the exact accepted values (note: bottom sizes use the 'W28 | FR 38' format, footwear uses EU sizes).",
    mimeType: "text/plain",
  },
  () => ({
    contents: [
      {
        uri: "resource:///size-mapping",
        text: sizeMappingText,
      },
    ],
  }),
);

const app = server.registerWidget(
  "search-recove",
  {
    description: "Recove",
    _meta: {
      ui: {
        csp: {
          resourceDomains: ["https://images1.vinted.net"],
          redirectDomains: ["https://www.vinted.fr"],
        },
      },
    },
  },
  {
    description: toolDescription,
    inputSchema: {
      queries: z
        .array(querySchema)
        .min(1)
        .describe(
          "One or more search queries. Use multiple queries for outfit requests.",
        ),
      filters: filtersSchema
        .optional()
        .describe("Optional filters applied to all queries."),
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: false,
      destructiveHint: false,
    },
  },
  async ({ queries, filters }) => {
    try {
      const textList = queries.map((q) => q.query);
      const categoryTypeList = queries.map((q) => q.category_type);

      const apiFilters = filters
        ? {
            women: filters.women,
            price_min: filters.price_min,
            price_max: filters.price_max,
            size: filters.size,
            remove_fast_fashion: filters.remove_fast_fashion,
          }
        : undefined;

      const searchResponse = await apiClient.search(
        textList,
        categoryTypeList,
        apiFilters,
      );

      const results = searchResponse.entries.map((entry) => ({
        description: {
          text: entry.description.text,
          category_type: entry.description.category_type,
        },
        items: entry.items.map((item) => ({
          id: item.id,
          url: item.url,
          image_location: item.image_location,
          title: item.title,
          brand: item.brand ?? undefined,
          price: item.price ?? undefined,
          currency: item.currency ?? undefined,
          size: item.size ?? undefined,
          condition: item.condition ?? undefined,
          is_newest: item.is_newest ?? undefined,
          is_trending_brand: item.is_trending_brand ?? undefined,
          is_fast_fashion: item.is_fast_fashion ?? undefined,
          category_type: item.category_type,
          origin_id: item.origin_id,
        })),
      }));

      const summaryLines = results
        .map((r) => `${r.description.text}: ${r.items.length} items`)
        .join("\n");

      return {
        structuredContent: {
          results: results.map((r) => ({
            description: r.description.text,
            count: r.items.length,
          })),
        },
        content: [{ type: "text" as const, text: summaryLines }],
        _meta: { results },
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

server.run();

export type AppType = typeof app;
