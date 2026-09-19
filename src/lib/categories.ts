// Category names are not translated: the same label is used on the Russian,
// English and Uzbek pages. The list itself lives in the Category table (see
// the getCategories family in projects.ts); the admin adds, reorders and
// deletes entries straight from the project form's dropdown.

export const CATEGORY_MAX_LENGTH = 40;
// Guards against a pathological value reaching the DB or the filter bar.
const MAX_PER_PROJECT = 12;

/**
 * Narrows an untyped value from one project's `categories` JSON column:
 * trims, caps length, drops blanks, and dedupes case-insensitively while
 * keeping the first spelling.
 */
export function sanitiseCategories(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const kept: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim().slice(0, CATEGORY_MAX_LENGTH);
    if (!trimmed) continue;
    if (kept.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) continue;
    kept.push(trimmed);
    if (kept.length >= MAX_PER_PROJECT) break;
  }
  return kept;
}

/**
 * Maps names onto `vocabulary` (ordered by priority): keeps only the ones it
 * contains, in its spelling and its order. The DB compares names
 * case-insensitively, so this does too.
 */
export function orderByVocabulary(names: string[], vocabulary: string[]): string[] {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  return vocabulary.filter((name) => wanted.has(name.toLowerCase()));
}
