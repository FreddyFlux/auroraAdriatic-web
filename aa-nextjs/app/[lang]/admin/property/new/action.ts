"use server";

import { auth, firestore } from "@/firebase/server";
import { propertyDataSchema } from "@/validation/propertySchema";
import { writeClient } from "@/lib/sanity";
import slugify from "slugify";

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

// Helper function to check if slug is unique
const isSlugUnique = async (slug: string): Promise<boolean> => {
  try {
    const snapshot = await firestore
      .collection("properties")
      .where("slug", "==", slug)
      .get();
    return snapshot.empty;
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
};

export const createProperty = async (
  data: {
    title: string;
    slug: string;
    description: string;
    location: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    pricePerNight: number;
    area: number;
    status: string;
    isPublic: boolean;
    checkInTime?: string;
    checkOutTime?: string;
    minimumStay?: number;
    maximumStay?: number;
    contactEmail?: string;
    contactPhone?: string;
    amenities?: string[];
    houseRules?: string[];
  },
  authToken: string
) => {
  const verifiedToken = await auth.verifyIdToken(authToken);
  if (!verifiedToken.admin) {
    return {
      error: true,
      message: "You are not authorized to access this resource.",
    };
  }

  const validation = propertyDataSchema.safeParse(data);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  // Generate slug from title if not provided
  const slug = data.slug || generateSlug(data.title);

  // Check if slug is unique
  const isUnique = await isSlugUnique(slug);
  if (!isUnique) {
    return {
      error: true,
      message:
        "A property with this title already exists. Please choose a different title.",
    };
  }

  try {
    // Prepare property data with the validated slug
    const propertyData = {
      ...data,
      slug,
      created: new Date(),
      updated: new Date(),
    };

    // Filter out undefined values to prevent Firestore errors
    const filteredPropertyData = Object.fromEntries(
      Object.entries(propertyData).filter(([, value]) => value !== undefined)
    );

    // Create property in Firebase
    const property = await firestore
      .collection("properties")
      .add(filteredPropertyData);

    // Create property in Sanity with minimal schema (only if writeClient is available)
    let sanityDocumentId = null;
    if (writeClient) {
      try {
        const sanityProperty = await writeClient.create({
          _type: "property",
          propertyId: property.id, // Read-only: Use the same ID as Firebase
          title: data.title, // Read-only: From Firebase data
          location: data.location, // Read-only: From Firebase data
          // Note: description and other content fields are optional and not auto-generated to allow manual editing
        });
        sanityDocumentId = sanityProperty._id;
      } catch (sanityError) {
        console.warn("Failed to create Sanity document:", sanityError);
        // Continue without failing the entire operation
      }
    } else {
      console.warn(
        "SANITY_API_TOKEN not configured. Property created in Firebase only. Add SANITY_API_TOKEN to enable Sanity integration."
      );
    }

    return {
      propertyId: property.id,
      sanityDocumentId,
    };
  } catch (error) {
    console.error("Error creating property:", error);
    return {
      error: true,
      message: "Failed to create property. Please try again.",
    };
  }
};
