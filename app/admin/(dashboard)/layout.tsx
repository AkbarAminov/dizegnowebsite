import Link from "next/link";
import { signOut } from "@/lib/auth";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-neutral-100">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0d0d0d]/95 px-6 py-4 backdrop-blur">
        <Link href="/admin" className="text-sm font-semibold tracking-wide uppercase">
          Dizegno Admin
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/admin" className="text-neutral-400 transition-colors hover:text-white">
            Projects
          </Link>
          <Link
            href="/admin/messages"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            Messages
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              Sign out
            </button>
          </form>
        </nav>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
