import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";

// Guards the admin UI and its API: unauthenticated pages redirect to the
// login form, unauthenticated API calls get a 401.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = await isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/admin/login")) {
    return loggedIn ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }
  if (loggedIn) return NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
