import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactPopup, ContactPopupProvider } from "@/components/ContactPopup";
import { PageTransition } from "@/components/PageTransition";
import { JsonLd } from "@/components/JsonLd";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { OG_IMAGE, SITE_NAME, SITE_URL, plainText } from "@/lib/seo";
import { organizationJsonLd } from "@/lib/structuredData";

// Root layout of the public site. Living under [lang] lets <html lang> be
// accurate per locale while the pages stay fully static — the admin has its
// own root layout in src/app/admin/layout.tsx, so the two never mix.
//
// Public pages are statically rendered and refreshed on demand by admin
// mutations (see revalidatePublicSite). The hourly window is a safety net
// for changes made outside the admin, e.g. a seed run.
export const revalidate = 3600;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#141414",
  colorScheme: "dark",
};

function resolveLocale(raw: string): Locale {
  // proxy.ts only ever routes real locales here; the fallback keeps the
  // type honest without turning a stray value into a hard error.
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

// Site-wide defaults; every page narrows title/description/canonical via pageMetadata().
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const lang = resolveLocale((await params).lang);
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: plainText(dict.seo.home.title), template: `%s — ${SITE_NAME}` },
    description: plainText(dict.seo.home.description),
    applicationName: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: { type: "website", siteName: SITE_NAME, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const lang = resolveLocale((await params).lang);
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full">
        <ContactPopupProvider>
          <Header lang={lang} nav={dict.nav} />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer lang={lang} dict={dict} />
          <ContactPopup popup={dict.contactPopup} form={dict.contact} />
        </ContactPopupProvider>
        <JsonLd data={organizationJsonLd(dict)} />
      </body>
    </html>
  );
}
