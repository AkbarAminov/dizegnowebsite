import type { Metadata } from "next";
import Link from "next/link";
import { WorkGrid } from "@/components/WorkGrid";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { EndCTA } from "@/components/EndCTA";
import { getPublishedProjects } from "@/lib/projects";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale, localeHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

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
    </>
  );
}
