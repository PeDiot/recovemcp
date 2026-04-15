import { publicEncrypt, constants } from "node:crypto";

const BASE_URL = "https://api2.shoprecove.com";

export interface SearchFilters {
  women?: boolean;
  price_min?: number;
  price_max?: number;
  size_list?: string[];
  is_fast_fashion?: boolean;
}

export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  image_location: string;
  women: boolean;
  category_type: string;
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
  category_type: string;
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

function encryptSecretKey(publicKeyPem: string, secretKey: string): string {
  const encrypted = publicEncrypt(
    {
      key: publicKeyPem,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(secretKey, "utf-8"),
  );
  return encrypted.toString("hex");
}

export class ApiClient {
  private secretKey: string | null = null;
  private cachedPublicKey: string | null = null;

  private getSecretKey(): string {
    if (!this.secretKey) {
      const key = process.env.API_KEY;
      if (!key) {
        throw new Error("API_KEY not found in environment variables");
      }
      this.secretKey = key;
    }
    return this.secretKey;
  }

  private async fetchPublicKey(): Promise<string> {
    if (this.cachedPublicKey) return this.cachedPublicKey;

    const response = await fetch(`${BASE_URL}/public_key`);
    if (!response.ok) {
      throw new Error(`Failed to fetch public key: ${response.status}`);
    }

    const data = (await response.json()) as { public_key: string };
    this.cachedPublicKey = data.public_key;
    return this.cachedPublicKey;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const publicKey = await this.fetchPublicKey();
    const ciphertext = encryptSecretKey(publicKey, this.getSecretKey());

    return {
      Accept: "application/json",
      "X-API-SECRET": ciphertext,
    };
  }

  async search(
    textList: string[],
    categoryTypeList: string[],
    filters?: SearchFilters,
    userId?: string,
  ): Promise<SearchResponse> {
    const params = new URLSearchParams();
    params.set("text_list", JSON.stringify(textList));
    params.set("category_type_list", JSON.stringify(categoryTypeList));

    if (filters) {
      params.set("filters", JSON.stringify(filters));
    }
    if (userId) {
      params.set("user_id", userId);
    }

    const url = `${BASE_URL}/search/texts?${params.toString()}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<SearchResponse>;
  }
}

export const apiClient = new ApiClient();
