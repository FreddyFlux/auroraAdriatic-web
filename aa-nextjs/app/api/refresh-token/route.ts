import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // This endpoint is deprecated - redirect to the client-side refresh page
  const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";
  const url = new URL(request.url);
  const language = url.pathname.split("/")[1] || "en";

  return NextResponse.redirect(
    new URL(
      `/${language}/refresh?redirect=${encodeURIComponent(redirectUrl)}`,
      request.url
    )
  );
}
