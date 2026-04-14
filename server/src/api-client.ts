import { publicEncrypt, constants } from "node:crypto";

const BASE_URL = "https://api2.shoprecove.com";

export interface SearchQuery {
  keywords: string;
  catalog_ids?: number[];
  color_ids?: number[];
  material_ids?: number[];
  price_to?: number;
  limit?: number;
}

export interface SearchResultItem {
  id: number;
  url: string;
  image_url: string;
  image_base64?: string | null;
  title: string;
  brand: string;
  price: number;
  currency: string;
  size?: string | null;
  condition?: string | null;
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

  private async getHeaders(
    contentType?: string,
  ): Promise<Record<string, string>> {
    const publicKey = await this.fetchPublicKey();
    const ciphertext = encryptSecretKey(publicKey, this.getSecretKey());

    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-API-SECRET": ciphertext,
    };

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    return headers;
  }

  async search(queries: SearchQuery[]): Promise<SearchResultItem[][]> {
    const headers = await this.getHeaders("application/json");

    const response = await fetch(`${BASE_URL}/vinted/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({ queries }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error ${response.status}: ${errorText}`);
    }

    return response.json() as Promise<SearchResultItem[][]>;
  }
}

export const apiClient = new ApiClient();
