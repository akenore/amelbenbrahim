import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, readToken } from "@/lib/auth/token";

const isDev = process.env.NODE_ENV === "development";

/**
 * Strict Content Security Policy: only scripts carrying this request's nonce run
 * ('strict-dynamic' lets them load the Next.js chunks). Next.js reads the nonce
 * from the request header and adds it to its own scripts.
 */
function contentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // React and Motion write style attributes (they cannot run code).
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    // Google Maps on the contact page.
    "frame-src https://www.google.com https://maps.google.com",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimistic gate for the dashboard (signature and expiry only). Every dashboard
  // page and Server Action still checks the account and its role on the server.
  if (
    pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/dashboard/connexion") &&
    !readToken(request.cookies.get(SESSION_COOKIE)?.value)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages and Server Actions; not static files, optimized images or uploaded media.
      source:
        "/((?!_next/static|_next/image|media/|img/|og/|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml|manifest.webmanifest).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
