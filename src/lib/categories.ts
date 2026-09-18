// The categories a project can be tagged with, shown as checkboxes in the
// admin and as filters on /work/. Single-language on purpose: unlike the
// rest of the project copy these are not translated, so the same label is
// used on the Russian, English and Uzbek pages.
//
// To add or retire a category, edit this list — there is no admin screen
// for it. Removing one here does not rewrite existing projects; a stored
// value that is no longer on the list is simply ignored (see
// sanitiseCategories), so a project keeps its remaining tags.
export const CATEGORIES = [
  "Finance & Banking",
  "Automotive",
  "Food & Delivery",
  "Healthcare",
  "Retail",
  "Sport & Events",
  "Digital & Web",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

/**
 * Narrows an untyped value from the `Project.categories` JSON column to the
 * categories that currently exist, in the order this list defines them —
 * the column is schemaless, so nothing guarantees what is in there.
 */
export function sanitiseCategories(value: unknown): Category[] {
  if (!Array.isArray(value)) return [];
  const stored = new Set(value.filter(isCategory));
  return CATEGORIES.filter((category) => stored.has(category));
}
