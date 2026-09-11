export const LOCALES = ["ru", "en", "uz"] as const;

export type Locale = (typeof LOCALES)[number];

// Russian is the unprefixed default (e.g. /work/); English and Uzbek get a
// URL prefix (/en/work/, /uz/work/). Keeping the default unprefixed avoids
// changing any of the site's existing indexed URLs.
export const DEFAULT_LOCALE: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Language names shown in their own script, regardless of the current
// locale — used by the public switcher and the admin's per-locale tabs.
export const LOCALE_LABELS: Record<Locale, string> = { ru: "РУС", en: "ENG", uz: "O'ZB" };

export function mapLocales<T, U>(value: Record<Locale, T>, fn: (value: T, locale: Locale) => U): Record<Locale, U> {
  return Object.fromEntries(LOCALES.map((locale) => [locale, fn(value[locale], locale)])) as Record<Locale, U>;
}

// Builds the href for `path` (always starting with "/") in `locale`.
export function localeHref(locale: Locale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}

// Splits a pathname into its locale and the unprefixed path, e.g.
// "/en/work/" -> { locale: "en", path: "/work/" }, "/work/" -> { locale: "ru", path: "/work/" }.
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) || "/" };
    }
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}

// All static UI copy, translated per locale. DB-driven content (project
// title/category/description/credits) is translated separately, via
// ProjectTranslation — see src/lib/projects.ts.
export type Dictionary = {
  nav: { work: string; answers: string; contact: string; homeAria: string; menuOpenAria: string; menuCloseAria: string };
  work: { title: string; all: string };
  projectNav: { previous: string; next: string; related: string };
  projectInfo: { toggle: string };
  gallery: { view: string; openImage: string; openVideo: string };
  answers: { title: string };
  contact: {
    title: string;
    intro: string;
    addressLine2: string;
    formName: string;
    formEmail: string;
    formMessage: string;
    formSubmit: string;
    formSubmitting: string;
    formSuccess: string;
    formError: string;
  };
  contactPopup: { title: string; intro: string; closeAria: string; openAria: string };
  endCta: { line1: string; cta: string };
};
