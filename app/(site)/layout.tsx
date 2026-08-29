import { Header } from "@/components/Header";
import { EndCTA } from "@/components/EndCTA";
import { ContactPopup } from "@/components/ContactPopup";
import { ContactPopupProvider } from "@/components/ContactPopupProvider";
import { PageTransition } from "@/components/PageTransition";

// Public-site chrome, scoped to this route group only — /admin (a
// sibling of this group under the root layout) never sees any of it.
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
