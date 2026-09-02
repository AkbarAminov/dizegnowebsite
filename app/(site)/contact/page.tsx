import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { ContactForm } from "@/components/ContactForm";
import { ContactLinks } from "@/components/ContactLinks";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="min-h-screen px-5 pt-28 pb-20 md:px-8 md:pt-36">
      <div className="grid gap-16 md:grid-cols-2">
        <RevealOnScroll>
          <h1 className="text-4xl font-medium uppercase tracking-tight md:text-6xl">Contact</h1>
          <p className="mt-6 max-w-sm text-sm opacity-70">
            Dizegno
            <br />
            Tashkent, Uzbekistan
          </p>
          <ContactLinks className="mt-6" />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <ContactForm />
        </RevealOnScroll>
      </div>
    </section>
  );
}
