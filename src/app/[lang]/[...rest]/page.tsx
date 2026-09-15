import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { plainText } from "@/lib/seo";

// Anything under a locale that no other route claims is a 404 — routed
// through notFound() so src/app/[lang]/not-found.tsx renders inside the
// site layout (header, footer, translated copy) instead of Next's bare
// default page.
export async function generateMetadata({ params }: PageProps<"/[lang]/[...rest]">): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  return { title: plainText(dict.notFound.title), robots: { index: false, follow: false } };
}

export default function CatchAllPage() {
  notFound();
}
