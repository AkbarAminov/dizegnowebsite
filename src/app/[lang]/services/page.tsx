import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ProcessSection } from "@/components/ProcessSection";
import { PartnersMarquee } from "@/components/PartnersMarquee";
import { EndCTA } from "@/components/EndCTA";
import { JsonLd } from "@/components/JsonLd";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, servicesJsonLd } from "@/lib/structuredData";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/services/",
    title: dict.seo.services.title,
    description: dict.seo.services.description,
  });
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  const { services } = dict;

  return (
    <>
      <section className="px-5 pt-28 pb-16 md:px-8 md:pt-36 md:pb-24">
        <RevealOnScroll>
          <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">{services.title}</h1>
        </RevealOnScroll>

        <ol className="mt-14 border-t border-white/15 md:mt-20">
          {services.items.map((item, i) => (
            <li key={item.title} id={`service-${i + 1}`} className="scroll-mt-24 border-b border-white/15 py-10 md:py-14">
              <RevealOnScroll className="grid gap-6 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-x-8">
                <span className="text-sm opacity-40">{String(i + 1).padStart(2, "0")}</span>
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                  <div>
                    <h2 className="text-2xl font-medium uppercase tracking-tight md:text-3xl">{item.title}</h2>
                    <p className="mt-5 max-w-xl text-base opacity-80">{item.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-tight opacity-50">{services.includesLabel}</p>
                    <ul className="mt-3 flex flex-col gap-2 text-sm">
                      {item.includes.map((line) => (
                        <li key={line} className="flex gap-3">
                          <span className="text-accent" aria-hidden>
                            &mdash;
                          </span>
                          {line}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 text-xs uppercase tracking-tight opacity-50">{services.resultLabel}</p>
                    <p className="mt-2 max-w-md text-sm">{item.result}</p>
                  </div>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </section>

      <ProcessSection copy={services.process} />
      <PartnersMarquee label={dict.partners.title} />
      <EndCTA dict={dict.endCta} />

      <JsonLd data={servicesJsonLd(dict, lang)} />
      <JsonLd data={breadcrumbJsonLd([{ name: dict.nav.services, path: "/services/" }], lang)} />
    </>
  );
}
