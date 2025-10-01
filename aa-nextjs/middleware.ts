import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

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

// Extract language from path
function extractLanguageFromPath(pathname: string) {
  const segments = pathname.split("/");
  const language = segments[1];
  const pathWithoutLang = "/" + segments.slice(2).join("/");

  return {
    language: supportedLocales.includes(language) ? language : defaultLocale,
    pathWithoutLang: pathWithoutLang === "/" ? "" : pathWithoutLang,
  };
}

export async function middleware(request: NextRequest) {
  if (request.method === "POST") {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Handle language redirection for root path and paths without language
  const { language, pathWithoutLang } = extractLanguageFromPath(pathname);

  // Redirect root path to default language
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // If path doesn't start with a valid language code, redirect to default language
  if (pathname !== "/" && !pathname.startsWith(`/${language}`)) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }

  // If invalid language code, redirect to default language
  if (!supportedLocales.includes(language) && pathname.split("/")[1]) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathWithoutLang}`, request.url)
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  // Check paths without language prefix for auth logic
  const pathForAuth = pathWithoutLang;

  if (
    !token &&
    (pathForAuth.startsWith("/login") ||
      pathForAuth.startsWith("/register") ||
      pathForAuth.startsWith("/forgot-password") ||
      pathForAuth.startsWith("/refresh"))
  ) {
    return NextResponse.next();
  }

  if (
    token &&
    (pathForAuth.startsWith("/login") ||
      pathForAuth.startsWith("/register") ||
      pathForAuth.startsWith("/forgot-password"))
  ) {
    return NextResponse.redirect(new URL(`/${language}`, request.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL(`/${language}`, request.url));
  }

  try {
    const decodedToken = decodeJwt(token);

    if (decodedToken.exp && (decodedToken.exp - 300) * 1000 < Date.now()) {
      return NextResponse.redirect(
        new URL(
          `/${language}/refresh?redirect=${encodeURIComponent(pathname)}`,
          request.url
        )
      );
    }

    if (!decodedToken.admin && pathForAuth.startsWith("/admin")) {
      return NextResponse.redirect(new URL(`/${language}`, request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL(`/${language}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Handle root redirects
    "/",
    // Handle language-prefixed routes
    "/:lang/admin",
    "/:lang/admin/:path*",
    "/:lang/login",
    "/:lang/register",
    "/:lang/forgot-password",
    "/:lang/refresh",
    // Handle routes that might not have language prefix (for redirection)
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/refresh",
  ],
};
