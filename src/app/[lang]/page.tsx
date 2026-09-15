import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { WorkGrid } from "@/components/WorkGrid";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { WhySection } from "@/components/WhySection";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { EndCTA } from "@/components/EndCTA";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getPublishedProjects } from "@/lib/projects";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale, localeHref } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

// Pinned projects come first (see getPublishedProjects), so the home page
// shows the ones the admin chose to feature; the rest live on /work/.
const FEATURED_COUNT = 6;

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
      <Hero lang={lang} hero={dict.home.hero} facts={dict.home.facts} />

      {featured.length > 0 && (
        <section className="pb-16 md:pb-24">
          <RevealOnScroll className="mb-6 flex items-baseline justify-between gap-4 px-5 md:mb-8 md:px-8">
            <h2 className="text-xl uppercase tracking-tight opacity-60">{dict.home.selectedWork.title}</h2>
            <Link
              href={localeHref(lang, "/work/")}
              className="group flex shrink-0 items-center gap-2 text-sm uppercase tracking-tight transition-opacity duration-200 hover:opacity-70"
            >
              {dict.home.selectedWork.all}
              <span className="text-accent transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden>
                &rarr;
              </span>
            </Link>
          </RevealOnScroll>
          <WorkGrid projects={featured} lang={lang} />
        </section>
      )}

      <ServicesSection lang={lang} copy={dict.home.services} items={dict.services.items} />
      <ProcessSection copy={dict.home.process} />
      <WhySection why={dict.home.why} industries={dict.home.industries} />
      <PartnersMarquee title={dict.partners.title} />
      <EndCTA dict={dict.endCta} />
    </>
  );
}
