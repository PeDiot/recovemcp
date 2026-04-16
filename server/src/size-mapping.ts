import { z } from "zod";

export const outerwearSizes = [
  "XS", "S", "M", "L", "XL",
  "XXXS", "XXS", "XXL", "XXXL",
  "4XL", "5XL", "6XL", "7XL", "8XL", "9XL",
] as const;

export const topSizes = [
  "XS", "S", "M", "L", "XL",
  "XXXS", "XXS", "XXL", "XXXL",
  "4XL", "5XL", "6XL", "7XL", "8XL", "9XL",
] as const;

export const bottomSizes = [
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
] as const;

export const dressSizes = [
  "XS", "S", "M", "L", "XL",
  "XXXS", "XXS", "XXL", "XXXL",
  "4XL", "5XL", "6XL", "7XL", "8XL", "9XL",
] as const;

export const footwearSizes = [
  "34", "34.5", "35", "35.5", "36", "36.5", "37", "37.5",
  "38", "38.5", "39", "39.5", "40", "40.5", "41", "41.5",
  "42", "42.5", "43", "43.5", "44", "44.5", "45", "45.5",
  "46", "46.5", "47", "47.5", "48", "48.5", "49", "50", "51", "52",
] as const;

export type OuterwearSize = (typeof outerwearSizes)[number];
export type TopSize = (typeof topSizes)[number];
export type BottomSize = (typeof bottomSizes)[number];
export type DressSize = (typeof dressSizes)[number];
export type FootwearSize = (typeof footwearSizes)[number];

const outerwearSizeCategorySchema = z.object({
  key: z.literal("outerwear"),
  values: z.array(z.enum(outerwearSizes)).describe("Outerwear sizes."),
});

const topSizeCategorySchema = z.object({
  key: z.literal("top"),
  values: z.array(z.enum(topSizes)).describe("Top sizes."),
});

const bottomSizeCategorySchema = z.object({
  key: z.literal("bottom"),
  values: z.array(z.enum(bottomSizes)).describe("Bottom sizes (use W/FR format for numeric waist sizes)."),
});

const dressSizeCategorySchema = z.object({
  key: z.literal("dress"),
  values: z.array(z.enum(dressSizes)).describe("Dress sizes."),
});

const footwearSizeCategorySchema = z.object({
  key: z.literal("footwear"),
  values: z.array(z.enum(footwearSizes)).describe("Footwear sizes (EU)."),
});

export const sizeCategorySchema = z.discriminatedUnion("key", [
  outerwearSizeCategorySchema,
  topSizeCategorySchema,
  bottomSizeCategorySchema,
  dressSizeCategorySchema,
  footwearSizeCategorySchema,
]);

export type SizeCategory = z.infer<typeof sizeCategorySchema>;

const allCategories = [
  { key: "outerwear", values: outerwearSizes },
  { key: "top", values: topSizes },
  { key: "bottom", values: bottomSizes },
  { key: "dress", values: dressSizes },
  { key: "footwear", values: footwearSizes },
] as const;

function buildSizeMappingText(): string {
  const lines = ["Available sizes by category type for the size filter:\n"];

  for (const cat of allCategories) {
    lines.push(`${cat.key}: ${cat.values.join(", ")}`);
  }

  return lines.join("\n");
}

export const sizeMappingText = buildSizeMappingText();
