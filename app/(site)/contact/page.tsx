import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact — Dizegno" };

export default function ContactPage() {
  return (
    <Section theme="dark" className="min-h-screen px-5 pt-28 pb-20 md:px-8 md:pt-36">
      <div className="grid gap-16 md:grid-cols-2">
        <RevealOnScroll>
          <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">Contact</h1>
          <p className="mt-6 max-w-sm text-sm opacity-70">
            Dizegno
            <br />
            Tashkent, Uzbekistan
          </p>

          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a href="mailto:dizegno.design@gmail.com" className="underline underline-offset-4 opacity-80 transition-opacity duration-200 hover:opacity-100">
              dizegno.design@gmail.com
            </a>
            <a href="tel:+998933938274" className="underline underline-offset-4 opacity-80 transition-opacity duration-200 hover:opacity-100">
              +998 93 393 82 74
            </a>
            <a
              href="https://t.me/Here_for"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 opacity-80 transition-opacity duration-200 hover:opacity-100"
            >
              Telegram — @Here_for
            </a>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <ContactForm />
        </RevealOnScroll>
      </div>
    </Section>
  );
}
