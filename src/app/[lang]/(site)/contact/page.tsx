import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ContactForm } from "@/components/ContactForm";
import { ContactLinks } from "@/components/ContactLinks";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  return { title: dict.contact.title };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);

  return (
    <section className="min-h-screen px-5 pt-28 pb-20 md:px-8 md:pt-36">
      <div className="grid gap-16 md:grid-cols-2">
        <RevealOnScroll>
          <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">{dict.contact.title}</h1>
          <p className="mt-6 max-w-sm text-base opacity-80">{dict.contact.intro}</p>
          <p className="mt-6 max-w-sm text-sm opacity-70">
            Dizegno
            <br />
            {dict.contact.addressLine2}
          </p>
          <ContactLinks className="mt-6" />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <ContactForm dict={dict.contact} />
        </RevealOnScroll>
      </div>
    </section>
  );
}
