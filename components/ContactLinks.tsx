import { CONTACT } from "@/lib/site";

const linkClass = "underline underline-offset-4 opacity-80 transition-opacity duration-200 hover:opacity-100";

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 text-sm ${className}`}>
      <a href={`mailto:${CONTACT.email}`} className={linkClass}>
        {CONTACT.email}
      </a>
      <a href={CONTACT.phoneHref} className={linkClass}>
        {CONTACT.phone}
      </a>
      <a href={CONTACT.telegramHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Telegram — {CONTACT.telegram}
      </a>
    </div>
  );
}
