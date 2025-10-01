"use server";

import { auth, firestore } from "@/firebase/server";
import { eventDataSchema } from "@/validation/eventSchema";
import slugify from "slugify";

// Helper function to generate slug
const generateSlug = (title: string): string => {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

// Helper function to check if slug is unique (excluding current event)
const isSlugUnique = async (
  slug: string,
  excludeEventId: string
): Promise<boolean> => {
  try {
    const snapshot = await firestore
      .collection("events")
      .where("slug", "==", slug)
      .get();
    return snapshot.docs.every((doc) => doc.id !== excludeEventId);
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
};

// Helper function to get event by ID
export const getEventById = async (eventId: string) => {
  try {
    const doc = await firestore.collection("events").doc(eventId).get();

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
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
      maxParticipants: data.maxParticipants,
      price: data.price,
      category: data.category,
      status: data.status,
      isPublic: data.isPublic,
      requirements: data.requirements,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      created: data.created.toDate(),
      updated: data.updated.toDate(),
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export const updateEvent = async (
  eventId: string,
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

  // Check if slug is unique (excluding current event)
  const isUnique = await isSlugUnique(slug, eventId);
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
      updated: new Date(),
    };

    // Filter out undefined values to prevent Firestore errors
    const filteredEventData = Object.fromEntries(
      Object.entries(eventData).filter(([, value]) => value !== undefined)
    );

    // Update event in Firebase
    await firestore.collection("events").doc(eventId).update(filteredEventData);

    return {
      eventId: eventId,
    };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      error: true,
      message: "Failed to update event. Please try again.",
    };
  }
};
