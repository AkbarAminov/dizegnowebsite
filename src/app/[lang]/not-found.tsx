import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale, localeHref } from "@/lib/i18n";

// Covers both an unknown URL and notFound() from a page (e.g. a project
// slug that was unpublished). Renders inside the site layout, so the header
// and footer stay in place.
export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);

  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-6 px-5 pt-16 text-center md:pt-20">
      <p className="text-sm uppercase tracking-tight opacity-50">404</p>
      <h1 className="text-3xl font-medium uppercase tracking-tight md:text-5xl">{dict.notFound.title}</h1>
      <p className="max-w-sm text-base opacity-70">{dict.notFound.text}</p>
      <Link
        href={localeHref(lang, "/")}
        className="text-sm uppercase tracking-tight text-accent underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
      >
        {dict.notFound.cta}
      </Link>
    </section>
  );
}
