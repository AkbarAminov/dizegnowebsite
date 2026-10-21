import type { Metadata } from "next";
import Link from "next/link";
import { WorkGrid } from "@/components/WorkGrid";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { EndCTA } from "@/components/EndCTA";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedProjects } from "@/lib/projects";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale, localeHref } from "@/lib/i18n";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { homePageJsonLd } from "@/lib/structuredData";

// Cover shown when the home page is shared — webp first, jpg fallback for
// messengers/crawlers that unfurl webp poorly.
const COVER_ALT = "Dizegno — брендинговое агентство в Ташкенте";
const COVER_IMAGES = [
  { url: absoluteUrl("/cover.webp"), width: 900, height: 507, type: "image/webp", alt: COVER_ALT },
  { url: absoluteUrl("/cover.jpg"), width: 900, height: 507, type: "image/jpeg", alt: COVER_ALT },
];

// Pinned projects come first (see getPublishedProjects), so the home page
// shows the ones the admin chose to feature; the rest live on /work/.
const FEATURED_COUNT = 8;

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/",
    title: dict.seo.home.title,
    description: dict.seo.home.description,
    absoluteTitle: true,
    image: COVER_IMAGES,
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const [projects, dict] = await Promise.all([getPublishedProjects(lang), getDictionary(lang)]);
  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <>
      {featured.length > 0 && (
        <section className="pt-28 pb-16 md:pt-36 md:pb-24">
          <WorkGrid projects={featured} lang={lang} />
          <div className="mt-10 flex justify-end px-5 md:mt-14 md:px-8">
            <Link
              href={localeHref(lang, "/work/")}
              className="group inline-flex items-center gap-2 text-base uppercase tracking-tight text-accent transition-opacity duration-200 hover:opacity-70 md:text-lg"
            >
              {dict.home.selectedWork.all}
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden>
                &rarr;
              </span>
            </Link>
          </div>
        </section>
      )}

      <PartnersMarquee label={dict.partners.title} />
      <EndCTA dict={dict.endCta} />
      <JsonLd data={homePageJsonLd()} />
    </>
  );
}
