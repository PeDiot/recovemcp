import "./env.js";
import { McpServer } from "skybridge/server";
import { z } from "zod";
import { apiClient } from "./api-client.js";
import { toolDescription } from "./tool-description.js";
import { stylingInstructions } from "./styling-instructions.js";

const querySchema = z.object({
  description: z
    .string()
    .describe(
      "Short human-readable description of what this query searches for, in the user's language.",
    ),
  keywords: z.string().describe("Search keywords in French or English (French preferred for better results)."),
  catalog_ids: z
    .array(z.number())
    .optional()
    .describe("Catalog category IDs to filter by."),
  color_ids: z
    .array(z.number())
    .optional()
    .describe("Color IDs to filter by."),
  material_ids: z
    .array(z.number())
    .optional()
    .describe("Material IDs to filter by."),
  price_to: z
    .number()
    .optional()
    .describe("Maximum price in EUR."),
  limit: z
    .number()
    .optional()
    .describe("Max items to return per query. Defaults to 96."),
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
      "Fashion Art Director persona, style cheat sheet, and search workflow rules",
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
        .describe("One or more search queries. Use multiple queries for outfit requests."),
    },
    annotations: {
      readOnlyHint: true,
      openWorldHint: false,
      destructiveHint: false,
    },
  },
  async ({ queries }) => {
    try {
      const apiQueries = queries.map((q) => ({
        keywords: q.keywords,
        catalog_ids: q.catalog_ids,
        color_ids: q.color_ids,
        material_ids: q.material_ids,
        price_to: q.price_to,
        limit: q.limit,
      }));

      const apiResults = await apiClient.search(apiQueries);

      const results = queries.map((q, i) => ({
        description: q.description,
        items: (apiResults[i] ?? []).map((item) => ({
          id: String(item.id),
          url: item.url,
          image_url: item.image_url,
          title: item.title,
          brand: item.brand,
          price: item.price,
          currency: item.currency,
          size: item.size ?? undefined,
          condition: item.condition ?? undefined,
        })),
      }));

      const summaryLines = results
        .map((r) => `${r.description}: ${r.items.length} items`)
        .join("\n");

      return {
        structuredContent: {
          results: results.map((r) => ({
            description: r.description,
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
