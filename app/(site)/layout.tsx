import { Header } from "@/components/Header";
import { EndCTA } from "@/components/EndCTA";
import { ContactPopup, ContactPopupProvider } from "@/components/ContactPopup";
import { PageTransition } from "@/components/PageTransition";

// Public pages are statically rendered and refreshed on demand by admin
// mutations (see revalidatePublicSite). The hourly window is a safety net
// for changes made outside the admin, e.g. a seed run.
export const revalidate = 3600;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContactPopupProvider>
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <EndCTA />
      <ContactPopup />
    </ContactPopupProvider>
  );
}
