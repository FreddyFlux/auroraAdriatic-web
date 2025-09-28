import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/firebase/server";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("firebaseRefreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // In a real implementation, you would refresh the token using Firebase Admin SDK
    // For now, we'll just redirect to the original URL
    const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/";

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
