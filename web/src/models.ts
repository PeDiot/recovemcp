export interface Item {
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

export interface QueryResponse {
  description: { text: string; category_type: string };
  items: Item[];
}
