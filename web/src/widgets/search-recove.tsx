import "@/index.css";

import { mountWidget, useOpenExternal, useLayout } from "skybridge/web";
import { useToolInfo } from "../helpers.js";
import type { Item, QueryResponse } from "../models.js";
import { ItemsGrid } from "../components/ItemsGrid.js";

interface ApiItem {
  id: string;
  url: string;
  url_redirect?: string;
  image_location: string;
  title: string;
  brand?: string;
  price?: number;
  currency?: string;
  size?: string;
  condition?: string;
  is_newest?: boolean;
  is_trending_brand?: boolean;
  is_fast_fashion?: boolean;
  unix_created_at?: number;
  category_type: string;
  origin_id: string;
}

interface MetaResult {
  description: { text: string; category_type: string };
  items: ApiItem[];
}

function mapApiItemToItem(apiItem: ApiItem): Item {
  return {
    id: apiItem.id,
    url: apiItem.url,
    url_redirect: apiItem.url_redirect,
    image_location: apiItem.image_location,
    title: apiItem.title,
    brand: apiItem.brand,
    price: apiItem.price,
    currency: apiItem.currency,
    size: apiItem.size,
    condition: apiItem.condition,
    is_newest: apiItem.is_newest,
    is_trending_brand: apiItem.is_trending_brand,
    is_fast_fashion: apiItem.is_fast_fashion,
    unix_created_at: apiItem.unix_created_at,
    category_type: apiItem.category_type,
    origin_id: apiItem.origin_id,
  };
}

function SearchRecove() {
  const { input, isPending, responseMetadata } =
    useToolInfo<"search-recove">();
  const openExternal = useOpenExternal();
  const { theme } = useLayout();
  const isDark = theme === "dark";

  const handleClickOut = (item: Item) => {
    const href = item.url_redirect ?? item.url;
    if (href) {
      openExternal(href, { redirectUrl: false });
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

  const meta = responseMetadata as
    | { results?: MetaResult[]; error?: string }
    | undefined;
  const metaResults = meta?.results ?? [];
  const errorMessage = meta?.error;

  const queryResponses: QueryResponse[] = metaResults.map((result) => ({
    description: result.description,
    items: result.items.map(mapApiItemToItem),
  }));

  if (queryResponses.length === 0) {
    return (
      <div className={isDark ? "dark" : ""}>
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {errorMessage
              ? `Search failed: ${errorMessage}`
              : "No results found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="p-4 space-y-8">
        {queryResponses.map((qr, idx) => (
          <ItemsGrid
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
