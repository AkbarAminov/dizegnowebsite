import type { Locale } from "./i18n";

// Short prepositions, conjunctions and particles that should never be left
// alone at the end of a line — joined to the next word with a non-breaking
// space instead of a regular one.
const SHORT_WORDS: Record<Locale, string[]> = {
  ru: [
    "а", "и", "о", "у", "я", "в", "во", "вы", "до", "за", "из", "из-за", "из-под",
    "к", "ко", "на", "над", "не", "ни", "но", "об", "от", "по", "под", "при",
    "с", "со", "та", "то", "ты", "уж", "чем", "что", "чтобы", "это", "если",
    "либо", "для", "же", "ли", "бы", "да", "про", "или", "ведь", "лишь", "вот",
  ],
  en: ["a", "an", "the", "of", "in", "on", "at", "to", "and", "or", "but", "as", "is", "for", "with", "it"],
  uz: ["va", "ham", "yoki", "lekin", "uchun", "bilan", "kabi", "deb", "balki", "goʻyo", "yoʻq"],
};

const NBSP = " ";

// Strips leading/trailing punctuation (quotes, dashes, brackets, commas…)
// so "и," or «в still match the bare word for the short-word check.
function bareWord(word: string): string {
  return word.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

export function preventOrphans(text: string, locale: Locale): string {
  if (!text) return text;
  const shortWords = new Set(SHORT_WORDS[locale]);
  const words = text.split(" ");

  let result = "";
  for (let i = 0; i < words.length; i++) {
    result += words[i];
    if (i < words.length - 1) {
      result += shortWords.has(bareWord(words[i])) ? NBSP : " ";
    }
  }
  return result;
}

// Applies preventOrphans to every string leaf of an object/array — used for
// whole dictionaries and content trees rather than field-by-field calls.
export function preventOrphansDeep<T>(value: T, locale: Locale): T {
  if (typeof value === "string") return preventOrphans(value, locale) as T;
  if (Array.isArray(value)) return value.map((item) => preventOrphansDeep(item, locale)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, preventOrphansDeep(item, locale)])
    ) as T;
  }
  return value;
}
