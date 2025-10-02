import { z } from "zod";

export const eventDataSchema = z
  .object({
    title: z.string().min(1, { message: "Event title is required." }),
    slug: z.string().min(1, { message: "Event slug is required." }),
    description: z
      .string()
      .min(10, "Description must contain at least 10 characters."),
    location: z.string().min(3, "Location must contain at least 3 characters."),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    startDate: z.date({
      required_error: "Start date is required.",
    }),
    endDate: z.date({
      required_error: "End date is required.",
    }),
    durationDays: z
      .number()
      .min(1, "Duration must be at least 1 day")
      .int("Duration must be a whole number"),
    minParticipants: z
      .number()
      .min(1, "Minimum participants must be at least 1"),
    maxParticipants: z
      .number()
      .min(1, "Maximum participants must be at least 1"),
    price: z.number().min(0, "Price cannot be negative"),
    category: z.enum(
      [
        "yacht-charter",
        "wine-tasting",
        "olive-oil-tasting",
        "cultural-tour",
        "adventure",
        "culinary",
        "wellness",
        "other",
      ],
      {
        message: "Please select an event category",
      }
    ),
    status: z.enum(["draft", "published", "cancelled", "completed"]),
    isPublic: z.boolean().default(true),
    requirements: z.string().optional(),
    contactEmail: z.string().email("Invalid email address").optional(),
    contactPhone: z.string().optional(),
  })
  .refine((data) => data.minParticipants <= data.maxParticipants, {
    message:
      "Minimum participants must be less than or equal to maximum participants",
    path: ["minParticipants"],
  });

export const eventImagesSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File).optional(),
    })
  ),
});

export const eventSchema = eventDataSchema.and(eventImagesSchema);
