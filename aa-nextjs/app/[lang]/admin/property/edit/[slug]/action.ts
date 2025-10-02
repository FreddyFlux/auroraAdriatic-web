"use server";

import { auth, firestore } from "@/firebase/server";
import { propertyDataSchema } from "@/validation/propertySchema";
import slugify from "slugify";

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

// Helper function to check if slug is unique (excluding current property)
const isSlugUnique = async (
  slug: string,
  excludePropertyId: string
): Promise<boolean> => {
  try {
    const snapshot = await firestore
      .collection("properties")
      .where("slug", "==", slug)
      .get();
    return snapshot.docs.every((doc) => doc.id !== excludePropertyId);
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
};

// Helper function to get property by ID
export const getPropertyById = async (propertyId: string) => {
  try {
    const doc = await firestore.collection("properties").doc(propertyId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      location: data.location,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      guests: data.guests,
      pricePerNight: data.pricePerNight,
      area: data.area,
      status: data.status,
      isPublic: data.isPublic,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      minimumStay: data.minimumStay,
      maximumStay: data.maximumStay,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      amenities: data.amenities,
      houseRules: data.houseRules,
      created: data.created.toDate(),
      updated: data.updated.toDate(),
    };
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
};

export const updateProperty = async (
  propertyId: string,
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

  // Check if slug is unique (excluding current property)
  const isUnique = await isSlugUnique(slug, propertyId);
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
      updated: new Date(),
    };

    // Filter out undefined values to prevent Firestore errors
    const filteredPropertyData = Object.fromEntries(
      Object.entries(propertyData).filter(([, value]) => value !== undefined)
    );

    // Update property in Firebase
    await firestore
      .collection("properties")
      .doc(propertyId)
      .update(filteredPropertyData);

    return {
      propertyId: propertyId,
    };
  } catch (error) {
    console.error("Error updating property:", error);
    return {
      error: true,
      message: "Failed to update property. Please try again.",
    };
  }
};
