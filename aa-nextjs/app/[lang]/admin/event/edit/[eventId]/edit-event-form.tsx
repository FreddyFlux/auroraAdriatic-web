"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/validation/eventSchema";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";
import { updateEvent, getEventById } from "./action";
import { useEffect } from "react";

// Simple client-side slug generation for preview (server will validate)
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

type EventFormData = {
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
  images: Array<{
    id: string;
    url: string;
    file?: File;
  }>;
};

interface EditEventFormProps {
  eventId: string;
}

export default function EditEventForm({ eventId }: EditEventFormProps) {
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      maxParticipants: 1,
      price: 0,
      category: "yacht-charter",
      status: "draft",
      isPublic: true,
      requirements: "",
      contactEmail: "",
      contactPhone: "",
      images: [],
    },
  });

  // Auto-generate slug when title changes
  useEffect(() => {
    const title = form.watch("title");
    if (title) {
      const generatedSlug = generateSlug(title);
      form.setValue("slug", generatedSlug);
    }
  }, [form.watch("title")]);

  // Load event data (mock implementation - replace with actual data fetching)
  useEffect(() => {
    // This would typically fetch the event data from Firebase
    // For now, we'll use mock data
    const mockEventData = {
      title: "Sample Event",
      slug: "sample-event",
      description: "This is a sample event description",
      location: "Split, Croatia",
      startDate: new Date("2024-02-15"),
      endDate: new Date("2024-02-17"),
      maxParticipants: 12,
      price: 500,
      category: "yacht-charter",
      status: "published",
      isPublic: true,
      requirements: "Bring sunscreen and comfortable clothes",
      contactEmail: "info@aurora-adriatic.com",
      contactPhone: "+385 91 234 5678",
      images: [],
    };

    form.reset(mockEventData);
  }, [eventId, form]);

  const handleSubmit = async (data: EventFormData) => {
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      toast.error("Error!", {
        description: "You must be logged in to update events",
      });
      return;
    }

    try {
      const response = await updateEvent(eventId, data, token);

      if (response?.error) {
        toast.error("Error!", {
          description: response.message,
        });
        return;
      }

      toast.success("Success!", {
        description: "Event updated successfully",
      });

      router.push("/admin/event");
    } catch (error) {
      toast.error("Error!", {
        description: "Failed to update event",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
        <CardDescription>Update the information for your event</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="url-slug"
                  {...form.register("slug")}
                />
                <p className="text-xs text-muted-foreground">
                  This will be used in the URL. Auto-generated from title.
                </p>
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter event description"
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter event location"
                  {...form.register("location")}
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    {...form.register("startDate", {
                      valueAsDate: true,
                    })}
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    {...form.register("endDate", {
                      valueAsDate: true,
                    })}
                  />
                  {form.formState.errors.endDate && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yacht-charter">Yacht Charter</SelectItem>
                    <SelectItem value="wine-tasting">Wine Tasting</SelectItem>
                    <SelectItem value="olive-oil-tasting">
                      Olive Oil Tasting
                    </SelectItem>
                    <SelectItem value="cultural-tour">Cultural Tour</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="culinary">Culinary</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    {...form.register("maxParticipants", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.maxParticipants && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.maxParticipants.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    {...form.register("price", {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.price && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="Enter contact email"
                  {...form.register("contactEmail")}
                />
                {form.formState.errors.contactEmail && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.contactEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone (Optional)</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="Enter contact phone"
                  {...form.register("contactPhone")}
                />
                {form.formState.errors.contactPhone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (Optional)</Label>
            <textarea
              id="requirements"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter any special requirements or notes"
              {...form.register("requirements")}
            />
            {form.formState.errors.requirements && (
              <p className="text-sm text-destructive">
                {form.formState.errors.requirements.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isPublic"
              type="checkbox"
              className="rounded border-input bg-background text-primary focus:ring-ring"
              {...form.register("isPublic")}
            />
            <Label htmlFor="isPublic">Make this event public</Label>
          </div>

          <div className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/20">
            <p className="font-medium">Event Content</p>
            <p>
              Add detailed content and media in Sanity CMS at{" "}
              <a
                href="http://localhost:3333/structure/event"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                http://localhost:3333/structure/event
              </a>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              "Updating Event..."
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                Update Event
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
