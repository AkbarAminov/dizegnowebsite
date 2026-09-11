import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { WorkFilter } from "@/components/WorkFilter";
import { EndCTA } from "@/components/EndCTA";
import { getPublishedProjects } from "@/lib/projects";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  return { title: dict.work.title };
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const [projects, dict] = await Promise.all([getPublishedProjects(lang), getDictionary(lang)]);

  return (
    <>
      <section className="min-h-screen pt-28 pb-20 md:pt-36">
        <RevealOnScroll className="mb-10 px-5 md:px-8">
          <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">{dict.work.title}</h1>
        </RevealOnScroll>

        <WorkFilter projects={projects} lang={lang} allLabel={dict.work.all} />
      </section>
      <EndCTA dict={dict.endCta} />
    </>
  );
}
