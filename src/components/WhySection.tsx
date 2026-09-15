import type { Dictionary } from "@/lib/i18n";
import { RevealOnScroll } from "./RevealOnScroll";

export function WhySection({
  why,
  industries,
}: {
  why: Dictionary["home"]["why"];
  industries: Dictionary["home"]["industries"];
}) {
  return (
    <section className="border-t border-white/10 px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <RevealOnScroll>
          <h2 className="text-2xl font-medium uppercase tracking-tight md:text-4xl">{why.title}</h2>
          <p className="mt-6 max-w-md text-base opacity-70">{why.intro}</p>

          <p className="mt-10 text-xs uppercase tracking-tight opacity-50">{industries.title}</p>
          <ul className="mt-3 flex max-w-md flex-wrap gap-2">
            {industries.items.map((industry) => (
              <li key={industry} className="border border-white/15 px-3 py-1.5 text-xs uppercase tracking-tight opacity-80">
                {industry}
              </li>
            ))}
          </ul>
        </RevealOnScroll>

        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {why.items.map((item, i) => (
            <RevealOnScroll key={item.title} delay={Math.min(i * 0.08, 0.3)} className="border-t border-white/15 pt-5">
              <dt className="text-lg font-medium uppercase tracking-tight">{item.title}</dt>
              <dd className="mt-3 text-sm opacity-70">{item.text}</dd>
            </RevealOnScroll>
          ))}
        </dl>
      </div>
    </section>
  );
}
