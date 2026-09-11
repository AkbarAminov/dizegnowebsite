import { WorkGrid } from "@/components/WorkGrid";
import { EndCTA } from "@/components/EndCTA";
import { getPublishedProjects } from "@/lib/projects";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const [projects, dict] = await Promise.all([getPublishedProjects(lang), getDictionary(lang)]);

  return (
    <>
      <section className="min-h-screen pt-24 pb-20 md:pt-28">
        <WorkGrid projects={projects} lang={lang} />
      </section>
      <EndCTA dict={dict.endCta} />
    </>
  );
}
