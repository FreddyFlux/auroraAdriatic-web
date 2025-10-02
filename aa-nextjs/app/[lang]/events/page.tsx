import { Suspense } from "react";
import EventsFilter from "@/components/events-filter";
import EventsList from "@/components/events-list";
import { getFilteredEvents, EventFilters } from "@/lib/events";
import { getEventsByIds } from "@/lib/sanity";

interface EventsPageProps {
  params: { lang: string };
  searchParams: {
    search?: string;
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    minParticipants?: string;
    maxParticipants?: string;
    startDate?: string;
    endDate?: string;
    minDuration?: string;
    maxDuration?: string;
    status?: string;
  };
}

export default async function EventsPage({
  params,
  searchParams,
}: EventsPageProps) {
  const { lang } = await params;
  const locale = lang;

  const awaitedSearchParams = await searchParams;

  // Build filters from search params
  const filters: EventFilters = {
    search: awaitedSearchParams.search,
    category: awaitedSearchParams.category,
    location: awaitedSearchParams.location,
    minPrice: awaitedSearchParams.minPrice
      ? parseFloat(awaitedSearchParams.minPrice)
      : undefined,
    maxPrice: awaitedSearchParams.maxPrice
      ? parseFloat(awaitedSearchParams.maxPrice)
      : undefined,
    minParticipants: awaitedSearchParams.minParticipants
      ? parseInt(awaitedSearchParams.minParticipants)
      : undefined,
    maxParticipants: awaitedSearchParams.maxParticipants
      ? parseInt(awaitedSearchParams.maxParticipants)
      : undefined,
    startDate: awaitedSearchParams.startDate,
    endDate: awaitedSearchParams.endDate,
    minDuration: awaitedSearchParams.minDuration
      ? parseInt(awaitedSearchParams.minDuration)
      : undefined,
    maxDuration: awaitedSearchParams.maxDuration
      ? parseInt(awaitedSearchParams.maxDuration)
      : undefined,
    status: awaitedSearchParams.status,
  };

  // Fetch filtered events from Firebase
  const firebaseEvents = await getFilteredEvents(filters);

  // Extract event IDs and fetch corresponding Sanity content
  const eventIds = firebaseEvents.map((event) => event.id);
  const sanityEvents = await getEventsByIds(eventIds, locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Discover Events
        </h1>
        <p className="text-muted-foreground text-lg">
          Find the perfect experience for your Adriatic adventure
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">Loading filters...</div>
          </div>
        }
      >
        <EventsFilter locale={locale} />
      </Suspense>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {firebaseEvents.length}{" "}
          {firebaseEvents.length === 1 ? "event" : "events"} found
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        }
      >
        <EventsList
          firebaseEvents={firebaseEvents}
          sanityEvents={sanityEvents}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
