export const toolDescription = `Search for second-hand fashion items on Vinted. Accepts one or more search queries and returns matching items.

When the user asks for an outfit, decompose it into multiple queries (e.g. top, bottom, shoes, accessories) — one per item type.

For each item, return:
- query: FashionCLIP search query in English (≤10 words).
- category_type: one of [outerwear, top, bottom, footwear, accessories, dress].

Optional filters (applied to all queries):
- women: true for women's items, false for men's.
- price_min / price_max: price range in EUR.
- size_list: list of size strings. Consult the size-mapping resource for valid values per category type.
- is_fast_fashion: set to false to exclude fast fashion brands.`;
