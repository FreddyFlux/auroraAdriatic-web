"use server";

import { auth, firestore } from "@/firebase/server";
import { eventDataSchema } from "@/validation/eventSchema";
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
      .collection("events")
      .where("slug", "==", slug)
      .get();
    return snapshot.empty;
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
};

export const createEvent = async (
  data: {
    title: string;
    slug: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    maxParticipants: number;
    price: number;
    category: string;
    status: string;
    isPublic: boolean;
    requirements?: string;
    contactEmail?: string;
    contactPhone?: string;
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

  const validation = eventDataSchema.safeParse(data);
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
        "An event with this title already exists. Please choose a different title.",
    };
  }

  try {
    // Prepare event data with the validated slug
    const eventData = {
      ...data,
      slug,
      created: new Date(),
      updated: new Date(),
    };

    // Filter out undefined values to prevent Firestore errors
    const filteredEventData = Object.fromEntries(
      Object.entries(eventData).filter(([, value]) => value !== undefined)
    );

    // Create event in Firebase
    const event = await firestore.collection("events").add(filteredEventData);

    // Create event in Sanity with minimal schema (only if writeClient is available)
    let sanityDocumentId = null;
    if (writeClient) {
      try {
        const sanityEvent = await writeClient.create({
          _type: "event",
          eventId: event.id, // Read-only: Use the same ID as Firebase
          title: data.title, // Read-only: From Firebase data
          location: data.location, // Read-only: From Firebase data
          // Note: description and other content fields are optional and not auto-generated to allow manual editing
        });
        sanityDocumentId = sanityEvent._id;
      } catch (sanityError) {
        console.warn("Failed to create Sanity document:", sanityError);
        // Continue without failing the entire operation
      }
    } else {
      console.warn(
        "SANITY_API_TOKEN not configured. Event created in Firebase only. Add SANITY_API_TOKEN to enable Sanity integration."
      );
    }

    return {
      eventId: event.id,
      sanityDocumentId,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      error: true,
      message: "Failed to create event. Please try again.",
    };
  }
};
