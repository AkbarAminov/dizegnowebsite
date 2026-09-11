import "server-only";
import { cache } from "react";
import type { Dictionary, Locale } from "./i18n";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import("./dictionaries/ru").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
  uz: () => import("./dictionaries/uz").then((m) => m.default),
};

export const getDictionary = cache((locale: Locale) => loaders[locale]());
