import type { Metadata } from "next";
import "../globals.css";

// Root layout of the admin. Separate from the public site's root layout
// (src/app/[lang]/layout.tsx) so the dashboard never inherits the public
// header, footer, contact popup or locale handling.
export const metadata: Metadata = {
  title: { default: "Dizegno Admin", template: "%s — Dizegno" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
