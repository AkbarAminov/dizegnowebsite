import type { Dictionary } from "@/lib/i18n";
import { RevealOnScroll } from "./RevealOnScroll";
import { SectionHeader } from "./SectionHeader";

export function ProcessSection({ copy }: { copy: Dictionary["home"]["process"] }) {
  return (
    <section className="border-t border-white/10 px-5 py-16 md:px-8 md:py-24">
      <RevealOnScroll>
        <SectionHeader title={copy.title} intro={copy.intro} />
      </RevealOnScroll>

      <ol className="mt-10 grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
        {copy.steps.map((step, i) => (
          <li key={step.title}>
            <RevealOnScroll delay={Math.min(i * 0.08, 0.3)}>
              <span className="text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-lg font-medium uppercase tracking-tight">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm opacity-70">{step.text}</p>
            </RevealOnScroll>
          </li>
        ))}
      </ol>
    </section>
  );
}
