import EditEventForm from "./edit-event-form";
import { getEventBySlug } from "@/lib/events";
import { notFound } from "next/navigation";

interface EditEventPageProps {
  params: {
    slug: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { slug } = await params;

  // Fetch event by slug
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
        <p className="text-muted-foreground">Update your event details</p>
      </div>
      <EditEventForm eventId={event.id} slug={slug} />
    </div>
  );
}
