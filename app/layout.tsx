import type { Metadata } from "next";
import "./globals.css";

// Root layout owns <html>/<body> only. The public site and /admin each add
// their own chrome in a nested layout so neither leaks into the other.
export const metadata: Metadata = {
  title: {
    default: "Dizegno — Branding Agency",
    template: "%s — Dizegno",
  },
  description:
    "Dizegno is a branding agency based in Tashkent, Uzbekistan, led by Akbar Aminov — identity, visual systems and brand strategy for banking, retail and sports clients across the CIS region.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
