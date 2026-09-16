import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ServicesAccordion } from "@/components/ServicesAccordion";
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

        <ServicesAccordion
          items={services.items}
          includesLabel={services.includesLabel}
          resultLabel={services.resultLabel}
        />
      </section>

      <ProcessSection copy={services.process} />
      <PartnersMarquee label={dict.partners.title} />
      <EndCTA dict={dict.endCta} />

      <JsonLd data={servicesJsonLd(dict, lang)} />
      <JsonLd data={breadcrumbJsonLd([{ name: dict.nav.services, path: "/services/" }], lang)} />
    </>
  );
}
