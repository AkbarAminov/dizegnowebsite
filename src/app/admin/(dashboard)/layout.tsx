import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logout } from "../actions";
import { AdminNav } from "./AdminNav";
import { focusRing } from "./ui";

export const metadata: Metadata = { title: "Admin" };

// Admin pages always read the live database; never prerender them.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const unread = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="min-h-screen bg-surface text-neutral-100">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-surface/95 px-4 py-4 backdrop-blur md:px-8">
        <Link href="/admin" className="text-sm font-semibold tracking-wide uppercase">
          Dizegno Admin
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <AdminNav unread={unread} />
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={`text-neutral-400 transition-colors hover:text-white ${focusRing}`}
          >
            View site
          </a>
          <form action={logout}>
            <button type="submit" className={`text-neutral-400 transition-colors hover:text-white ${focusRing}`}>
              Sign out
            </button>
          </form>
        </nav>
      </header>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
