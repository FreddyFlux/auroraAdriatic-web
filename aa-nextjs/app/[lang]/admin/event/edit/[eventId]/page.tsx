import EditEventForm from "./edit-event-form";

interface EditEventPageProps {
  params: {
    eventId: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { eventId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Event</h1>
        <p className="text-muted-foreground">Update your event details</p>
      </div>
      <EditEventForm eventId={eventId} />
    </div>
  );
}
