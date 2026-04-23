export const toolDescription = `Search for second-hand fashion items on Vinted. Accepts one or more search queries and returns matching items.

Strict Rules:
- Each query must be a FashionCLIP search query in English, ≤10 words, describing ONE garment.
- NEVER include gender words (homme, femme, man, woman, men, women, etc.) in query text. Gender is handled by the "women" filter.
- Set "women" only if the user explicitly specifies gender (true for women's, false for men's). Omit otherwise.
- Use filters.size only if the user mentions a size. When a size is mentioned, READ the size-mapping resource (resource:///size-mapping) FIRST to get the exact valid values (bottom sizes use "W28 | FR 38" format, footwear uses EU numbers). Passing an unrecognized size silently drops the filter.
- Use filters.remove_fast_fashion = true only if the user explicitly wants to exclude fast fashion.
- When the user mentions a style, era, aesthetic, vibe, reference, or asks for an outfit/look/styling help, READ the styling-instructions resource (resource:///styling-instructions) BEFORE building queries.

Workflow:
1. Analyze the user's intent and any reference (silhouette, palette, vibe). If a style or inspiration is mentioned, read styling-instructions first.
2. If the user asks for an outfit or a look, split it into multiple single-item queries (top, bottom, shoes, outerwear, accessories) — one per item type.
3. For each item, decide type, color, material, silhouette, and brands (match aesthetics to the Style Cheat Sheet when relevant), and whether any filter applies.
4. Write each query as a strong FashionCLIP phrase in English (≤10 words) — mix garment + silhouette + material + color. Example shape: "pink metallic studded crop top", "beige tailored wool trench coat".
5. If a size is mentioned, read size-mapping and build the size filter with exact values.
6. Build ONE tool call with the array of queries and shared filters.

Input schema:
- queries: array of { query: string (FashionCLIP, English, ≤10 words), category_type: one of [outerwear, top, bottom, footwear, accessories, dress] }.
- filters (optional, applied to all queries):
  - women: boolean, set only if gender is specified.
  - price_min / price_max: numbers, EUR.
  - size: array of { key: category_type, values: string[] } — e.g. [{ "key": "top", "values": ["M", "L"] }, { "key": "footwear", "values": ["42"] }]. Consult size-mapping for valid values.
  - remove_fast_fashion: boolean, set to true to exclude fast fashion brands.`;
