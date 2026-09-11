import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { EndCTA } from "@/components/EndCTA";
import { getAnswers } from "@/lib/answers";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/answers">): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  return { title: dict.answers.title };
}

export default async function AnswersPage({ params }: PageProps<"/[lang]/answers">) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  const sections = getAnswers(lang);

  return (
    <>
      <section className="min-h-screen px-5 pt-28 pb-20 md:px-8 md:pt-36">
        <RevealOnScroll className="mb-14 md:mb-20">
          <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">{dict.answers.title}</h1>
        </RevealOnScroll>

        <div className="flex flex-col gap-14 md:gap-20">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-6 text-xl uppercase tracking-tight opacity-60 md:mb-8">{section.title}</h2>

              <div className="grid gap-x-10 border-t border-white/15 md:grid-cols-2">
                {section.items.map((item, i) => (
                  <RevealOnScroll
                    key={item.number}
                    delay={Math.min((i % 2) * 0.08, 0.16)}
                    className="border-b border-white/15 py-6 md:py-8"
                  >
                    <span className="text-sm opacity-40">{item.number}</span>
                    <h3 className="mt-1 text-lg font-medium md:text-xl">{item.question}</h3>
                    <p className="mt-3 max-w-md text-base opacity-70">{item.answer}</p>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <EndCTA dict={dict.endCta} />
    </>
  );
}
