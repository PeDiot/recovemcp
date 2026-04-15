import type { Item } from "../models.js";
import { formatPriceWithCurrency } from "../utils.js";

interface ItemCardProps {
  item: Item;
  onClickOut?: (item: Item) => void;
  onItemPress?: (item: Item) => boolean;
}

export function ItemCard({ item, onClickOut, onItemPress }: ItemCardProps) {
  const handleItemPress = (e: React.MouseEvent) => {
    if (!item.url) return;

    if (onItemPress?.(item)) {
      e.preventDefault();
      return;
    }

    onClickOut?.(item);
  };

  if (item.id === "placeholder") {
    return (
      <div className="w-full mb-4">
        <div className="bg-white dark:bg-white/[0.08] rounded-2xl overflow-hidden">
          <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-white/[0.05] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-4">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-white dark:bg-white/[0.08] rounded-2xl overflow-hidden hover:shadow-md active:shadow-md dark:hover:bg-white/[0.12] dark:active:bg-white/[0.12] transition-all duration-200 text-left no-underline"
        onClick={handleItemPress}
      >
        <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-white/[0.05] rounded-2xl overflow-hidden relative">
          <img
            src={item.image_location}
            alt={item.title}
            className="w-full h-full object-cover rounded-2xl"
            loading="lazy"
          />
          {item.is_newest && (
            <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm">
              <span className="text-xs text-gray-900 dark:text-gray-100">New</span>
            </div>
          )}
        </div>

        <div className="p-4 min-h-[100px]">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 truncate">
            {item.title}
          </h3>

          <div className="flex items-center mb-1.5">
            <span className="text-sm text-[#ecadb7] truncate">
              {item.brand ? item.brand.toUpperCase() : " "}
            </span>
            {item.is_trending_brand && (
              <svg
                className="w-3 h-3 ml-1 text-yellow-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
          </div>

          {item.condition && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{item.condition}</p>
          )}

          <div className="flex justify-between items-center mt-1.5">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatPriceWithCurrency(item.price, item.currency)}
            </span>
            {item.size && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/[0.08] px-2 py-0.5 rounded-md">
                {item.size}
              </span>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}

export default ItemCard;
