import type { Metadata } from "next";
import "./globals.css";

// Kept deliberately minimal — this is the one true root layout Next.js
// requires (owns <html>/<body>), shared by both the public site and
// /admin. Each of those gets its own nested layout for its own chrome
// (app/(site)/layout.tsx vs app/admin/(dashboard)/layout.tsx) so neither
// leaks into the other — previously /admin inherited the public
// Header/EndCTA/ContactPopup because they lived here.
export const metadata: Metadata = {
  title: "Dizegno — Branding Agency",
  description:
    "Dizegno is a branding agency based in Tashkent, Uzbekistan, led by Akbar Aminov — identity, visual systems and brand strategy for banking, retail and sports clients across the CIS region.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
