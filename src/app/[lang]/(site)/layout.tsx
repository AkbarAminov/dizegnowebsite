import { Header } from "@/components/Header";
import { ContactPopup, ContactPopupProvider } from "@/components/ContactPopup";
import { PageTransition } from "@/components/PageTransition";
import { getDictionary } from "@/lib/getDictionary";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";

// Public pages are statically rendered and refreshed on demand by admin
// mutations (see revalidatePublicSite). The hourly window is a safety net
// for changes made outside the admin, e.g. a seed run.
export const revalidate = 3600;

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);

  return (
    <ContactPopupProvider>
      <Header lang={lang} dict={dict} />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <ContactPopup dict={dict} />
    </ContactPopupProvider>
  );
}
