import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";
import { sanitizeRedirectUrl } from "@/lib/url-helper";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
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
