import Link from "next/link";
import { CONTACT, NAV_LINKS } from "@/lib/site";
import { localeHref, type Dictionary, type Locale } from "@/lib/i18n";
import { Logo } from "./Logo";
import { FooterLanguageLinks } from "./FooterLanguageLinks";

const linkClass = "w-fit transition-opacity duration-200 hover:opacity-60";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  // Pages are static and refreshed at least hourly, so the year is always current.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-5 pt-16 pb-24 md:px-8 md:pt-20 md:pb-12">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] lg:gap-8">
        <div>
          <Link href={localeHref(lang, "/")} className="group inline-block" aria-label={dict.nav.homeAria}>
            <Logo className="h-7 w-auto" />
          </Link>
          <p className="mt-6 max-w-sm text-sm opacity-60">{dict.footer.tagline}</p>
        </div>

        <FooterColumn title={dict.footer.navTitle}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={localeHref(lang, link.href)} className={linkClass}>
              {dict.nav[link.key]}
            </Link>
          ))}
        </FooterColumn>

        <FooterColumn title={dict.footer.contactTitle}>
          <a href={`mailto:${CONTACT.email}`} className={linkClass}>
            {CONTACT.email}
          </a>
          {CONTACT.phones.map((phone) => (
            <a key={phone.href} href={phone.href} className={linkClass}>
              {phone.number}
            </a>
          ))}
        </FooterColumn>

        <FooterColumn title={dict.footer.socialTitle}>
          <a href={CONTACT.telegramHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Telegram
          </a>
          <a href={CONTACT.instagramHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
            Instagram
          </a>
          <p className="mt-4 text-xs uppercase tracking-tight opacity-50">{dict.footer.languageTitle}</p>
          <FooterLanguageLinks />
        </FooterColumn>
      </div>

      {/* Right padding keeps the floating "+" button off the location line. */}
      <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 pr-20 text-xs uppercase tracking-tight opacity-50 sm:flex-row sm:items-center sm:justify-between">
        <span>
          &copy; {year} Dizegno &middot; {dict.footer.rights}
        </span>
        <span>{dict.footer.location}</span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-tight opacity-50">{title}</p>
      <div className="mt-4 flex flex-col gap-2 text-sm">{children}</div>
    </div>
  );
}
