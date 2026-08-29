import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { getAllAnswers } from "@/lib/projects";

export const metadata: Metadata = { title: "Answers — Dizegno" };

export default function AnswersPage() {
  const sections = getAllAnswers();

  return (
    <Section theme="dark" className="min-h-screen px-5 pt-28 pb-20 md:px-8 md:pt-36">
      <RevealOnScroll className="mb-14 md:mb-20">
        <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">Answers</h1>
      </RevealOnScroll>

      <div className="flex flex-col gap-14 md:gap-20">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-6 text-xl uppercase tracking-tight opacity-60 md:mb-8">
              {section.title}
            </h2>

            <div className="grid gap-x-10 border-t border-white/15 md:grid-cols-2">
              {section.items.map((item) => (
                <div key={item.number} className="border-b border-white/15 py-6 md:py-8">
                  <span className="text-sm opacity-40">{item.number}</span>
                  <h3 className="mt-1 text-lg font-medium md:text-xl">{item.question}</h3>
                  <p className="mt-3 max-w-md text-base opacity-70">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
