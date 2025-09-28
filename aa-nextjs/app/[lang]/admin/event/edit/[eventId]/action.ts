"use server";

import { auth, firestore } from "@/firebase/server";
import { eventDataSchema } from "@/validation/eventSchema";

export const updateEvent = async (
  eventId: string,
  data: {
    title: string;
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

  try {
    // Prepare event data
    const eventData = {
      ...data,
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
