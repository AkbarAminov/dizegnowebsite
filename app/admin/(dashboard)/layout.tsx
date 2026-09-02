import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin" };

// Admin pages always read the live database; never prerender them.
export const dynamic = "force-dynamic";

const linkClass = "text-neutral-400 transition-colors hover:text-white";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-neutral-950/95 px-4 py-4 backdrop-blur md:px-8">
        <Link href="/admin" className="text-sm font-semibold tracking-wide uppercase">
          Dizegno Admin
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/admin" className={linkClass}>
            Projects
          </Link>
          <Link href="/admin/messages" className={linkClass}>
            Messages
          </Link>
          <Link href="/" target="_blank" className={linkClass}>
            View site
          </Link>
          <form action={logout}>
            <button type="submit" className={linkClass}>
              Sign out
            </button>
          </form>
        </nav>
      </header>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
