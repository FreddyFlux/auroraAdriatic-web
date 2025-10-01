import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircleIcon, CalendarIcon, EditIcon } from "lucide-react";
import { getAllEvents } from "@/lib/events";
import DeleteEventButton from "@/components/delete-event-button";

export default async function EventsPage() {
  const events = await getAllEvents();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">
            Manage your events and experiences
          </p>
        </div>
        <Link href="/admin/event/new">
          <Button>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {event.description}
                  </CardDescription>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    event.status === "published"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  }`}
                >
                  {event.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {event.startDate.toLocaleDateString()} -{" "}
                  {event.endDate.toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Max participants: {event.maxParticipants}
                </div>
                <div className="text-sm text-muted-foreground">
                  Price: €{event.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  Location: {event.location}
                </div>
                <div className="flex space-x-2 pt-2">
                  <Link href={`/admin/event/edit/${event.slug}`}>
                    <Button variant="outline" size="sm">
                      <EditIcon className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteEventButton eventId={event.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
