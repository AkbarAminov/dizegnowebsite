// The categories a project can be tagged with, shown as checkboxes in the
// admin and as filters on /work/. Single-language on purpose: unlike the
// rest of the project copy these are not translated, so the same label is
// used on the Russian, English and Uzbek pages.
//
// This list is only the starting set — the admin can type a new category
// straight into the dropdown, and it sticks as soon as the project is
// saved (the dropdown offers every category already in use, so the next
// project can just tick it). Editing this list changes the suggestions,
// never what is already stored.
export const SUGGESTED_CATEGORIES = [
  "Finance & Banking",
  "Automotive",
  "Food & Delivery",
  "Healthcare",
  "Retail",
  "Sport & Events",
  "Digital & Web",
  "Other",
] as const;

// Guards against a pathological value reaching the DB or the filter bar.
const MAX_LENGTH = 40;
const MAX_PER_PROJECT = 12;

// Trims, caps length, drops blanks, and dedupes case-insensitively while
// keeping the first spelling the admin used.
function clean(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  const kept: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim().slice(0, MAX_LENGTH);
    if (!trimmed) continue;
    if (kept.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) continue;
    kept.push(trimmed);
    if (kept.length >= limit) break;
  }
  return kept;
}

/**
 * Narrows an untyped value from one project's `categories` JSON column.
 * Free-form values are kept — the admin can invent categories, so this
 * can't be a whitelist.
 */
export function sanitiseCategories(value: unknown): string[] {
  return clean(value, MAX_PER_PROJECT);
}

/**
 * Suggestions first, then anything the admin has added, alphabetically.
 * Deliberately not capped at MAX_PER_PROJECT: that limit is per project,
 * while this is the whole vocabulary the dropdown offers.
 */
export function mergeCategoryOptions(used: string[]): string[] {
  const suggested = [...SUGGESTED_CATEGORIES];
  const extra = clean(used, 200)
    .filter((category) => !suggested.some((s) => s.toLowerCase() === category.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
  return [...suggested, ...extra];
}

/** Dedupes the whole vocabulary without applying the per-project cap. */
export function sanitiseCategoryVocabulary(value: unknown): string[] {
  return clean(value, 200);
}
