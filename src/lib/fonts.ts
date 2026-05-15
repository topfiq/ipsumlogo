import WebFont from "webfontloader";
import { FONT_LIST } from "./constants";

export function loadFont(family: string): Promise<void> {
  return new Promise((resolve, reject) => {
    WebFont.load({
      google: { families: [family] },
      active: () => resolve(),
      inactive: () => reject(new Error(`Failed to load font: ${family}`)),
      timeout: 5000,
    });
  });
}

export async function preloadFonts(): Promise<void> {
  const families = FONT_LIST.map((f) => f.family);
  return new Promise((resolve) => {
    WebFont.load({
      google: { families },
      active: () => resolve(),
      inactive: () => resolve(),
      timeout: 10000,
    });
  });
}

export function getFontCategories() {
  const categories = new Map<string, { family: string; category: string }[]>();
  FONT_LIST.forEach((font) => {
    if (!categories.has(font.category)) {
      categories.set(font.category, []);
    }
    categories.get(font.category)!.push(font);
  });
  return categories;
}
