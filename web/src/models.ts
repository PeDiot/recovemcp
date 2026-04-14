export interface Item {
  id: string;
  url: string;
  image_location: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  size?: string;
  condition?: string;
  is_newest?: boolean;
  is_trending_brand?: boolean;
}

export interface QueryResponse {
  description: { text: string };
  items: Item[];
}
