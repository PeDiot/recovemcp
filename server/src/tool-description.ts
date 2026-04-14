import catalogData from "../../data/catalog.json" with { type: "json" };
import colorData from "../../data/color.json" with { type: "json" };
import materialData from "../../data/material.json" with { type: "json" };

interface CatalogEntry {
  id: string;
  code: string;
  title: string;
  gender: "women" | "men";
}

interface IdTitle {
  id: string;
  title: string;
}

const catalog = catalogData as CatalogEntry[];
const colors = colorData as IdTitle[];
const materials = materialData as IdTitle[];

function buildCatalogDesc(entries: CatalogEntry[], gender: string): string {
  return entries
    .filter((e) => e.gender === gender)
    .map((e) => `${e.title}(${e.id})`)
    .join(", ");
}

function buildIdTitleDesc(entries: IdTitle[]): string {
  return entries.map((e) => `${e.title}(${e.id})`).join(", ");
}

export const toolDescription = `Search for second-hand items on Vinted. Accepts one or more search queries and returns matching items.

When the user asks for an outfit, decompose it into multiple queries (e.g. top, bottom, shoes, accessories) — one per item type. Each query should have a short description in the user's language for display and appropriate filters.

Use the keyword field for the main search term. Keywords can be in French or English (French preferred for better results on the platform). Use catalog_ids, color_ids, and material_ids to filter precisely. Always prefer specific category IDs over generic keywords when possible.

CATALOG IDS (Women): ${buildCatalogDesc(catalog, "women")}

CATALOG IDS (Men): ${buildCatalogDesc(catalog, "men")}

COLOR IDS: ${buildIdTitleDesc(colors)}

MATERIAL IDS: ${buildIdTitleDesc(materials)}`;
