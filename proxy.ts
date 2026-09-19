import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, readToken } from "@/lib/auth/token";

// Optimistic gate for the dashboard (signature and expiry only). Every dashboard
// page and Server Action still checks the account and its role on the server.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/dashboard/connexion")) return NextResponse.next();

  if (!readToken(request.cookies.get(SESSION_COOKIE)?.value)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
