import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/firebase/server";
import { firestore } from "@/firebase/server";
import { writeClient } from "@/lib/sanity";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    // Get the auth token from the Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header missing or invalid" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the token
    let user;
    try {
      user = await auth.verifyIdToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { propertyId } = params;

    console.log(
      `[DELETE] Starting delete process for propertyId: ${propertyId} by user: ${user.uid}`
    );

    // Check if writeClient is available
    if (!writeClient) {
      console.error(
        "[DELETE] Sanity writeClient not available - missing SANITY_API_TOKEN"
      );
      return NextResponse.json(
        {
          error:
            "Sanity API token not configured. Please contact administrator.",
        },
        { status: 500 }
      );
    }

    console.log(
      "[DELETE] Sanity writeClient is available, proceeding with deletion"
    );

    // Delete from Sanity CMS first
    // Find the Sanity document by propertyId and delete it
    const sanityQuery = `*[_type == "property" && propertyId == $propertyId][0]._id`;
    console.log(
      `[DELETE] Executing Sanity query: ${sanityQuery} with propertyId: ${propertyId}`
    );

    const sanityDocumentId = await writeClient.fetch<string | null>(
      sanityQuery,
      {
        propertyId,
      }
    );

    console.log(`[DELETE] Sanity document ID found: ${sanityDocumentId}`);

    if (sanityDocumentId) {
      console.log(
        `[DELETE] Attempting to delete Sanity document: ${sanityDocumentId}`
      );
      await writeClient.delete(sanityDocumentId);
      console.log(`[DELETE] Sanity document deleted successfully`);
    } else {
      console.log(
        `[DELETE] No Sanity document found for propertyId: ${propertyId}`
      );
    }

    // Delete from Firebase Firestore
    console.log(
      `[DELETE] Attempting to delete Firebase document: ${propertyId}`
    );
    await firestore.collection("properties").doc(propertyId).delete();
    console.log(`[DELETE] Firebase document deleted successfully`);

    return NextResponse.json({
      success: true,
      message:
        "Property deleted successfully from both Firebase and Sanity CMS.",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      {
        error: "Failed to delete property. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
