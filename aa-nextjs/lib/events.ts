import { firestore } from "@/firebase/server";
import { client } from "@/lib/sanity";

export interface Event {
  id: string;
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
  (Event & { sanityContent?: SanityEvent })[]
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
