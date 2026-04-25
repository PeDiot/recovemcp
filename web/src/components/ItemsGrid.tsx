import { useMemo, useState } from "react";
import type { QueryResponse, Item } from "../models.js";
import { ItemCard } from "./ItemCard.js";

type SortKey = "relevance" | "price_asc" | "price_desc" | "newest";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "price_asc", label: "Price ↑" },
  { key: "price_desc", label: "Price ↓" },
  { key: "newest", label: "Newest" },
];

function sortItems(items: Item[], sortKey: SortKey): Item[] {
  if (sortKey === "relevance") return items;

  const sorted = [...items];

  if (sortKey === "price_asc" || sortKey === "price_desc") {
    const direction = sortKey === "price_asc" ? 1 : -1;
    sorted.sort((a, b) => {
      const aHas = a.price != null;
      const bHas = b.price != null;
      if (!aHas && !bHas) return 0;
      if (!aHas) return 1;
      if (!bHas) return -1;
      return ((a.price as number) - (b.price as number)) * direction;
    });
    return sorted;
  }

  sorted.sort((a, b) => {
    const aHas = a.unix_created_at != null;
    const bHas = b.unix_created_at != null;
    if (!aHas && !bHas) return 0;
    if (!aHas) return 1;
    if (!bHas) return -1;
    return (b.unix_created_at as number) - (a.unix_created_at as number);
  });
  return sorted;
}

interface ItemsGridProps {
  queryResponse: QueryResponse;
  onClickOut?: (item: Item) => void;
  onItemPress?: (item: Item) => boolean;
}

export function ItemsGrid({
  queryResponse,
  onClickOut,
  onItemPress,
}: ItemsGridProps) {
  const [sortKey, setSortKey] = useState<SortKey>("relevance");

  const sortedItems = useMemo(
    () => sortItems(queryResponse.items, sortKey),
    [queryResponse.items, sortKey],
  );

  return (
    <div className="w-full border border-gray-200/80 dark:border-white/10 rounded-2xl p-3">
      <div className="mb-4 px-1 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h2 className="mt-1 text-base md:text-lg font-medium text-[#3B1228] dark:text-gray-100 leading-tight break-words">
            {queryResponse.description.text}
          </h2>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {queryResponse.items.length} finds
            </span>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Sort items"
          className="inline-flex w-fit max-w-full flex-wrap md:flex-nowrap items-center gap-1 bg-gray-100 dark:bg-white/[0.06] rounded-2xl p-1 shrink-0"
        >
          {SORT_OPTIONS.map((opt) => {
            const active = sortKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSortKey(opt.key)}
                className={[
                  "text-xs px-2.5 py-1 rounded-full transition-colors whitespace-nowrap",
                  active
                    ? "bg-white dark:bg-white/[0.14] text-[#3B1228] dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 py-1">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {sortedItems.map((item) => (
            <div key={item.id} className="w-48 flex-shrink-0">
              <ItemCard
                item={item}
                onClickOut={onClickOut}
                onItemPress={onItemPress}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemsGrid;
