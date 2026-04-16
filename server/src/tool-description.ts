export const toolDescription = `Search for second-hand fashion items on Vinted. Accepts one or more search queries and returns matching items.

When the user asks for an outfit, decompose it into multiple queries (e.g. top, bottom, shoes, accessories) — one per item type.

For each item, return:
- query: FashionCLIP search query in English (≤10 words).
- category_type: one of [outerwear, top, bottom, footwear, accessories, dress].

Optional filters (applied to all queries):
- women: set only if the user specifies gender. true for women's items, false for men's. Omit if unspecified.
- price_min / price_max: price range in EUR.
- size: array of { key, values } per category type (e.g. [{ "key": "top", "values": ["M", "L"] }, { "key": "footwear", "values": ["42"] }]). Consult the size-mapping resource for valid values.
- remove_fast_fashion: set to true to exclude fast fashion brands.`;
