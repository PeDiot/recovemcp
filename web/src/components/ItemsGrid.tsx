import type { QueryResponse, Item } from "../models.js";
import { ItemCard } from "./ItemCard.js";

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
  return (
    <div className="w-full border border-gray-200/80 dark:border-white/10 rounded-2xl p-3">
      <div className="mb-4 px-1">
        <h2 className="text-lg font-medium text-[#3B1228] dark:text-gray-100 leading-tight line-clamp-2">
          {queryResponse.description.text}
        </h2>
        <div className="flex items-center gap-1 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {queryResponse.items.length} finds
          </span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 py-1">
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {queryResponse.items.map((item) => (
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
