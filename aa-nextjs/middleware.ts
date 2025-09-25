import { NextRequest, NextResponse } from "next/server";

// Supported languages
const supportedLocales = ["en", "no", "hr"];
const defaultLocale = "en";

// Get locale from Accept-Language header or default to English
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");

  if (acceptLanguage) {
    // Parse Accept-Language header and find first supported locale
    const languages = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().toLowerCase())
      .map((lang) => lang.split("-")[0]); // Extract language code (e.g., 'en' from 'en-US')

    for (const lang of languages) {
      if (supportedLocales.includes(lang)) {
        return lang;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
