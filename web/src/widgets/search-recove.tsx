import "@/index.css";

import { mountWidget, useOpenExternal, useLayout } from "skybridge/web";
import { useToolInfo } from "../helpers.js";
import type { Item, QueryResponse } from "../models.js";
import { ItemsScrollableGrid } from "../components/ItemsScrollableGrid.js";

interface ApiItem {
  id: string;
  url: string;
  image_url: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  size?: string;
  condition?: string;
}

interface MetaResult {
  description: string;
  items: ApiItem[];
}

function mapApiItemToItem(apiItem: ApiItem): Item {
  return {
    id: apiItem.id,
    url: apiItem.url,
    image_location: apiItem.image_url,
    title: apiItem.title,
    brand: apiItem.brand,
    price: apiItem.price,
    currency: apiItem.currency,
    size: apiItem.size,
    condition: apiItem.condition,
  };
}

function SearchRecove() {
  const { input, isPending, responseMetadata } =
    useToolInfo<"search-recove">();
  const openExternal = useOpenExternal();
  const { theme } = useLayout();
  const isDark = theme === "dark";

  const handleClickOut = (item: Item) => {
    if (item.url) {
      openExternal(item.url, { redirectUrl: false });
    }
  };

  if (isPending) {
    const queryCount = input?.queries?.length ?? 0;
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#ecadb7] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Searching{queryCount > 1 ? ` (${queryCount} queries)` : ""}...
            </span>
          </div>
        </div>
      </div>
    );
  }

  const meta = responseMetadata as { results?: MetaResult[] } | undefined;
  const metaResults = meta?.results ?? [];

  const queryResponses: QueryResponse[] = metaResults.map((result) => ({
    description: { text: result.description },
    items: result.items.map(mapApiItemToItem),
  }));

  if (queryResponses.length === 0) {
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No results found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="p-4 space-y-8">
        {queryResponses.map((qr, idx) => (
          <ItemsScrollableGrid
            key={idx}
            queryResponse={qr}
            onClickOut={handleClickOut}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchRecove;

mountWidget(<SearchRecove />);
