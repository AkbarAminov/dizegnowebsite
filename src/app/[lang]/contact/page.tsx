import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ContactForm } from "@/components/ContactForm";
import { ContactLinks } from "@/components/ContactLinks";
import { JsonLd } from "@/components/JsonLd";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "/contact/",
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
  });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  const copy = dict.contact;

  return (
    <>
      <section className="min-h-dvh px-5 pt-28 pb-20 md:px-8 md:pt-36">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <RevealOnScroll>
            <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">{copy.title}</h1>
            <p className="mt-6 max-w-md text-base opacity-80 md:text-lg">{copy.lead}</p>

            <div className="mt-10">
              <h2 className="text-xs uppercase tracking-tight opacity-50">{copy.channelsTitle}</h2>
              <ContactLinks className="mt-3" />
              <p className="mt-4 text-sm opacity-60">
                {copy.location} &middot; {copy.timezone}
              </p>
            </div>

            <p className="mt-8 max-w-md text-sm opacity-60">{copy.ndaNote}</p>

            <div className="mt-12 border-t border-white/15 pt-8">
              <h2 className="text-xs uppercase tracking-tight opacity-50">{copy.nextTitle}</h2>
              <ol className="mt-6 flex flex-col gap-6">
                {copy.nextSteps.map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)]">
                    <span className="text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-base font-medium uppercase tracking-tight">{step.title}</h3>
                      <p className="mt-1 max-w-md text-sm opacity-70">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <h2 className="mb-8 text-xl uppercase tracking-tight opacity-60">{copy.formTitle}</h2>
            <ContactForm dict={copy} />
          </RevealOnScroll>
        </div>
      </section>

      <JsonLd data={breadcrumbJsonLd([{ name: dict.nav.contact, path: "/contact/" }], lang)} />
    </>
  );
}
