import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";

// Guards the admin UI and its API: unauthenticated pages redirect to the
// login form, unauthenticated API calls get a 401. Every other path is a
// public-site route; Russian is the unprefixed default, so anything that
// isn't already /en/* or /uz/* gets rewritten onto the ru branch of the
// [lang] route tree (the URL bar keeps showing the unprefixed path, and the
// page stays a plain static/ISR page — no per-visitor personalization).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const loggedIn = await isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value);

    if (pathname.startsWith("/admin/login")) {
      return loggedIn ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
    }
    if (loggedIn) return NextResponse.next();
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Other API routes (e.g. the public contact form) aren't part of the
  // localized page tree and never get a locale prefix.
  if (pathname.startsWith("/api/")) return NextResponse.next();

  const hasLocalePrefix = LOCALES.some(
    (locale) => locale !== DEFAULT_LOCALE && (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  );
  if (hasLocalePrefix) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Runs on every path except Next internals and files with an extension
  // (uploads, favicon, etc.) — those never need a locale prefix.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
