import Link from "next/link";
import { localeHref, type Dictionary, type Locale } from "@/lib/i18n";
import { RevealOnScroll } from "./RevealOnScroll";
import { ContactTrigger } from "./ContactTrigger";
import { primaryCtaClass, secondaryCtaClass } from "./buttons";

// Home-page opener: what the agency does, for whom, where — and the two
// actions a visitor can take. The facts strip repeats the three promises
// the FAQ makes (one curator, fixed price, NDA) above the fold.
export function Hero({
  lang,
  hero,
  facts,
}: {
  lang: Locale;
  hero: Dictionary["home"]["hero"];
  facts: Dictionary["home"]["facts"];
}) {
  return (
    <section className="px-5 pt-28 pb-14 md:px-8 md:pt-40 md:pb-20">
      <RevealOnScroll>
        <p className="text-sm uppercase tracking-tight opacity-60">{hero.eyebrow}</p>
        <h1 className="mt-5 max-w-6xl text-[clamp(2rem,8vw,7rem)] leading-[0.95] font-medium uppercase tracking-tight md:mt-6">
          {hero.title}
        </h1>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1} className="mt-10 grid gap-8 md:mt-14 md:grid-cols-2 md:items-end">
        <p className="max-w-xl text-base opacity-80 md:text-lg">{hero.lead}</p>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <ContactTrigger className={primaryCtaClass}>{hero.primaryCta}</ContactTrigger>
          <Link href={localeHref(lang, "/work/")} className={secondaryCtaClass}>
            {hero.secondaryCta}
          </Link>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.2}>
        <ul className="mt-14 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-3 md:mt-20">
          {facts.map((fact) => (
            <li key={fact.title}>
              <p className="text-sm font-medium uppercase tracking-tight">{fact.title}</p>
              <p className="mt-2 max-w-xs text-sm opacity-60">{fact.text}</p>
            </li>
          ))}
        </ul>
      </RevealOnScroll>
    </section>
  );
}
