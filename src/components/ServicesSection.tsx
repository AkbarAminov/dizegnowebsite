import Link from "next/link";
import { localeHref, type Dictionary, type Locale } from "@/lib/i18n";
import { RevealOnScroll } from "./RevealOnScroll";
import { SectionHeader } from "./SectionHeader";

// Compact service list for the home page; each row deep-links to its full
// description on /services/.
export function ServicesSection({
  lang,
  copy,
  items,
}: {
  lang: Locale;
  copy: Dictionary["home"]["services"];
  items: Dictionary["services"]["items"];
}) {
  return (
    <section className="border-t border-white/10 px-5 py-16 md:px-8 md:py-24">
      <RevealOnScroll>
        <SectionHeader title={copy.title} intro={copy.intro} />
      </RevealOnScroll>

      <ol className="mt-10 border-t border-white/15 md:mt-14">
        {items.map((item, i) => (
          <li key={item.title}>
            <RevealOnScroll delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={localeHref(lang, `/services/#service-${i + 1}`)}
                className="group grid gap-2 border-b border-white/15 py-5 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.4fr)_2rem] md:items-baseline md:gap-x-8 md:py-6"
              >
                <span className="text-sm opacity-40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-medium uppercase tracking-tight transition-opacity duration-200 group-hover:opacity-70 md:text-xl">
                  {item.title}
                </h3>
                <p className="text-sm opacity-70 md:text-base">{item.summary}</p>
                <span
                  className="hidden justify-self-end text-accent transition-transform duration-200 ease-out group-hover:translate-x-1 md:block"
                  aria-hidden
                >
                  &rarr;
                </span>
              </Link>
            </RevealOnScroll>
          </li>
        ))}
      </ol>

      <RevealOnScroll className="mt-8">
        <Link
          href={localeHref(lang, "/services/")}
          className="group inline-flex items-center gap-2 text-sm uppercase tracking-tight text-accent transition-opacity duration-200 hover:opacity-70"
        >
          {copy.all}
          <span className="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden>
            &rarr;
          </span>
        </Link>
      </RevealOnScroll>
    </section>
  );
}
