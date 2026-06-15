import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sanitizeRedirectUrl } from "@/lib/url-helper";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const localizedLegalPath = pathname.match(
    /^\/(?:en|en-US|zh|zh-CN|zh-TW|zh-HK|zh-MO|ja|ko|ru|fr|de|ar|es|it)\/(privacy-policy|terms-of-service)$/
  );
  if (localizedLegalPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localizedLegalPath[1]}`;
    url.search = search;
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/zh${pathname}`;
    url.search = search;
    return NextResponse.redirect(url, 302);
  }

  const response = intlMiddleware(request);

  // Clean up any absolute redirect URLs containing ports (e.g. :80 or :3000) in production
  const location = response.headers.get("Location");
  const cleanLocation = sanitizeRedirectUrl(location);
  if (cleanLocation && cleanLocation !== location) {
    response.headers.set("Location", cleanLocation);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/(en|en-US|zh|zh-CN|zh-TW|zh-HK|zh-MO|ja|ko|ru|fr|de|ar|es|it)/:path*",
    "/((?!privacy-policy|terms-of-service|api/|_next|_vercel|.*\\..*).*)",
  ],
};
