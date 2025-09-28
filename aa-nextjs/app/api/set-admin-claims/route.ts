import { NextRequest, NextResponse } from "next/server";
import { setAdminClaimsByEmail } from "@/lib/admin";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await setAdminClaimsByEmail(email);

    return NextResponse.json({
      success: true,
      message: `Admin claims set for ${email}`,
    });
  } catch (error) {
    console.error("Error setting admin claims:", error);
    return NextResponse.json(
      { error: "Failed to set admin claims" },
      { status: 500 }
    );
  }
}
