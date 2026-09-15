import { CONTACT } from "@/lib/site";

const linkClass = "underline underline-offset-4 opacity-80 transition-opacity duration-200 hover:opacity-100";

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 text-sm ${className}`}>
      <a href={`mailto:${CONTACT.email}`} className={linkClass}>
        {CONTACT.email}
      </a>
      <div className="flex flex-wrap items-center gap-2">
        {CONTACT.phones.map((phone, i) => (
          <span key={phone.href} className="flex items-center gap-2">
            {i > 0 && <span className="opacity-40">|</span>}
            <a href={phone.href} className={linkClass}>
              {phone.number}
            </a>
          </span>
        ))}
      </div>
      <a href={CONTACT.telegramHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Telegram — {CONTACT.telegram}
      </a>
      <a href={CONTACT.instagramHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Instagram — {CONTACT.instagram}
      </a>
    </div>
  );
}
