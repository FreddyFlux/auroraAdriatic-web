import MainCard from "./main-card";
import { getSanityImageUrl, SanityEvent } from "@/lib/sanity";
import { Event } from "@/lib/events";

interface EventsListProps {
  firebaseEvents: Event[];
  sanityEvents: SanityEvent[];
  locale: string;
}

export default function EventsList({
  firebaseEvents,
  sanityEvents,
  locale,
}: EventsListProps) {
  // Create a map of Sanity events by eventId for quick lookup
  const sanityEventMap = new Map(
    sanityEvents.map((event) => [event.eventId, event])
  );

  // Merge Firebase and Sanity data
  const mergedEvents = firebaseEvents.map((fbEvent) => {
    const sanityEvent = sanityEventMap.get(fbEvent.id);
    return {
      firebase: fbEvent,
      sanity: sanityEvent,
    };
  });

  if (mergedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No events found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      style={{ gridAutoRows: "1fr" }}
    >
      {mergedEvents.map(({ firebase, sanity }) => (
        <div key={firebase.id} className="flex flex-col h-full">
          <MainCard
            title={sanity?.titleTranslation || firebase.title}
            titleDescription={sanity?.catchphrase || `${firebase.location}`}
            contentText={
              sanity?.shortDescription ||
              firebase.description.substring(0, 100) + "..."
            }
            buttonText="View Details"
            image={sanity?.images?.[0]}
            imageUrl={
              sanity?.images?.[0]
                ? getSanityImageUrl(sanity.images[0])
                : undefined
            }
            href={`/${locale}/events/${firebase.slug}`}
          />
        </div>
      ))}
    </div>
  );
}
