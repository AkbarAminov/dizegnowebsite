"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "./ui";

const links = [
  { href: "/admin/", label: "Projects" },
  { href: "/admin/messages/", label: "Messages" },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        // /admin/projects/… still belongs to the Projects tab.
        const active = link.href === "/admin/" ? !pathname.startsWith("/admin/messages") : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 rounded px-1 py-0.5 transition-colors ${
              active ? "text-white" : "text-neutral-400 hover:text-white"
            } ${focusRing}`}
          >
            {link.label}
            {link.label === "Messages" && unread > 0 && (
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] leading-none font-semibold text-black">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}
