import type { SizeCategory } from "./models.js";

const sizeCategories: SizeCategory[] = [
  {
    key: "outerwear",
    label: "Outerwear",
    values: [
      "XS", "S", "M", "L", "XL",
      "XXXS", "XXS", "XXL", "XXXL",
      "4XL", "5XL", "6XL", "7XL", "8XL", "9XL"
    ],
  },
  {
    key: "top",
    label: "Top",
    values: [
      "XS", "S", "M", "L", "XL",
      "XXXS", "XXS", "XXL", "XXXL",
      "4XL", "5XL", "6XL", "7XL", "8XL", "9XL"
    ],
  },
  {
    key: "bottom",
    label: "Bottom",
    values: [
      "XS", "S", "M", "L", "XL",
      "W24 | FR 34", "W25 | FR 34", "W26 | FR 36", "W27 | FR 36",
      "W28 | FR 38", "W29 | FR 38", "W30 | FR 40", "W31 | FR 40",
      "W32 | FR 42", "W33 | FR 42",
      "XXXS", "XXS", "XXL", "XXXL",
      "4XL", "5XL", "6XL", "7XL", "8XL", "9XL",
      "W23 | FR 32", "W34 | FR 44", "W35 | FR 44",
      "W36 | FR 46", "W38 | FR 48", "W40 | FR 50",
      "W42 | FR 52", "W44 | FR 54", "W46 | FR 56",
      "W48 | FR 58", "W50 | FR 60", "W52 | FR 62", "W54 | FR 64",
    ],
  },
  {
    key: "dress",
    label: "Dress",
    values: [
      "XS", "S", "M", "L", "XL",
      "XXXS", "XXS", "XXL", "XXXL",
      "4XL", "5XL", "6XL", "7XL", "8XL", "9XL",
    ],
  },
  {
    key: "footwear",
    label: "Footwear",
    values: [
      "34", "34.5", "35", "35.5", "36", "36.5", "37", "37.5",
      "38", "38.5", "39", "39.5", "40", "40.5", "41", "41.5",
      "42", "42.5", "43", "43.5", "44", "44.5", "45", "45.5",
      "46", "46.5", "47", "47.5", "48", "48.5", "49", "50", "51", "52",
    ],
  },
];

function buildSizeMappingText(): string {
  const lines = ["Available sizes by category type for the size filter:\n"];

  for (const cat of sizeCategories) {
    lines.push(`${cat.key}: ${cat.values.join(", ")}`);
  }

  return lines.join("\n");
}

export const sizeMappingText = buildSizeMappingText();
