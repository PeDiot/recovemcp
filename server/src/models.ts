export type CategoryType =
  | "outerwear"
  | "top"
  | "bottom"
  | "footwear"
  | "accessories"
  | "dress";

import type { SizeCategory } from "./size-mapping.js";
export type { SizeCategory } from "./size-mapping.js";

export interface SearchFilters {
  women?: boolean;
  price_min?: number;
  price_max?: number;
  size?: SizeCategory[];
  remove_fast_fashion?: boolean;
}

export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  image_location: string;
  women: boolean;
  category_type: CategoryType;
  catalog_id?: number | null;
  brand?: string | null;
  price?: number | null;
  currency?: string | null;
  size?: string | null;
  condition?: string | null;
  color_id?: number | null;
  point_id?: string | null;
  score?: number | null;
  index_name?: string;
  unix_created_at?: number | null;
  is_newest?: boolean | null;
  is_fast_fashion?: boolean | null;
  is_trending_brand?: boolean | null;
  relevance?: number | null;
  item_description_id?: string | null;
  origin_id: string;
}

export interface ItemDescription {
  text: string;
  category_type: CategoryType;
  rank: number;
  score: string;
}

export interface SearchEntry {
  description: ItemDescription;
  items: SearchResultItem[];
}

export interface SearchResponse {
  entries: SearchEntry[];
}
