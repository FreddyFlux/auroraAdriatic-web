import { firestore } from "@/firebase/server";
import { client, writeClient } from "@/lib/sanity";
import slugify from "slugify";

export interface Event {
  id: string;
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
  created: Date;
  updated: Date;
}

export interface SanityEvent {
  _id: string;
  eventId: string;
  title: string;
  location: string;
  description?: unknown[];
  images?: unknown[];
  highlights?: unknown[];
  itinerary?: unknown[];
  included?: string[];
  notIncluded?: string[];
  requirements?: unknown[];
  testimonials?: unknown[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export const getEvents = async (): Promise<Event[]> => {
  try {
    const snapshot = await firestore
      .collection("events")
      .where("isPublic", "==", true)
      .orderBy("created", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created: doc.data().created.toDate(),
      updated: doc.data().updated.toDate(),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
    })) as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const snapshot = await firestore
      .collection("events")
      .orderBy("created", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created: doc.data().created.toDate(),
      updated: doc.data().updated.toDate(),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate(),
    })) as Event[];
  } catch (error) {
    console.error("Error fetching all events:", error);
    return [];
  }
};

export const getEventById = async (eventId: string): Promise<Event | null> => {
  try {
    const doc = await firestore.collection("events").doc(eventId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      created: data.created.toDate(),
      updated: data.updated.toDate(),
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
    } as Event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  try {
    const snapshot = await firestore
      .collection("events")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created: data.created.toDate(),
      updated: data.updated.toDate(),
      startDate: data.startDate.toDate(),
      endDate: data.endDate.toDate(),
    } as Event;
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return null;
  }
};

export const generateSlug = (title: string): string => {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

export const isSlugUnique = async (
  slug: string,
  excludeEventId?: string
): Promise<boolean> => {
  try {
    const snapshot = await firestore
      .collection("events")
      .where("slug", "==", slug)
      .get();

    if (excludeEventId) {
      // For updates, exclude the current event
      return snapshot.docs.every((doc) => doc.id !== excludeEventId);
    } else {
      // For new events, check if any documents exist
      return snapshot.empty;
    }
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
};

export const getSanityEventByEventId = async (
  eventId: string
): Promise<SanityEvent | null> => {
  try {
    const query = `*[_type == "event" && eventId == "${eventId}"][0]`;
    const event = await client.fetch(query);
    return event;
  } catch (error) {
    console.error("Error fetching Sanity event:", error);
    return null;
  }
};

export const getEventsWithSanityContent = async (): Promise<
  (Event & { sanityContent?: SanityEvent | null })[]
> => {
  try {
    const events = await getEvents();
    const eventsWithContent = await Promise.all(
      events.map(async (event) => {
        const sanityContent = await getSanityEventByEventId(event.id);
        return {
          ...event,
          sanityContent,
        };
      })
    );
    return eventsWithContent;
  } catch (error) {
    console.error("Error fetching events with Sanity content:", error);
    return [];
  }
};

export const deleteEvent = async (eventId: string, _authToken: string) => {
  try {
    console.log(`[DELETE] Starting delete process for eventId: ${eventId}`);

    // Check if writeClient is available
    if (!writeClient) {
      console.error(
        "[DELETE] Sanity writeClient not available - missing SANITY_API_TOKEN"
      );
      return {
        error: true,
        message:
          "Sanity API token not configured. Please contact administrator.",
      };
    }

    console.log(
      "[DELETE] Sanity writeClient is available, proceeding with deletion"
    );

    // Delete from Sanity CMS first
    // Find the Sanity document by eventId and delete it
    const sanityQuery = `*[_type == "event" && eventId == $eventId][0]._id`;
    console.log(
      `[DELETE] Executing Sanity query: ${sanityQuery} with eventId: ${eventId}`
    );

    const sanityDocumentId = await writeClient.fetch<string | null>(
      sanityQuery,
      {
        eventId,
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
      console.log(`[DELETE] No Sanity document found for eventId: ${eventId}`);
    }

    // Delete from Firebase Firestore
    console.log(`[DELETE] Attempting to delete Firebase document: ${eventId}`);
    await firestore.collection("events").doc(eventId).delete();
    console.log(`[DELETE] Firebase document deleted successfully`);

    return {
      error: false,
      message: "Event deleted successfully from both Firebase and Sanity CMS.",
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      error: true,
      message: "Failed to delete event. Please try again.",
    };
  }
};
