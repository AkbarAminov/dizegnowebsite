import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
      <p className="text-sm uppercase tracking-tight opacity-50">404</p>
      <h1 className="text-3xl font-medium uppercase tracking-tight md:text-5xl">Page not found</h1>
      <Link href="/" className="text-sm uppercase tracking-tight text-accent underline underline-offset-4 hover:opacity-70">
        Back to work
      </Link>
    </div>
  );
}
