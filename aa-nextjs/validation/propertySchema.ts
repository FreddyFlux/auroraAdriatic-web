import { z } from "zod";

export const propertyDataSchema = z
  .object({
    title: z.string().min(1, { message: "Property title is required." }),
    slug: z.string().min(1, { message: "Property slug is required." }),
    description: z
      .string()
      .min(10, "Description must contain at least 10 characters."),
    location: z.string().min(3, "Location must contain at least 3 characters."),
    propertyType: z.enum(
      [
        "apartment",
        "house",
        "villa",
        "condo",
        "studio",
        "penthouse",
        "townhouse",
        "other",
      ],
      {
        message: "Please select a property type",
      }
    ),
    bedrooms: z
      .number()
      .min(0, "Bedrooms cannot be negative")
      .int("Bedrooms must be a whole number"),
    bathrooms: z
      .number()
      .min(0, "Bathrooms cannot be negative")
      .int("Bathrooms must be a whole number"),
    guests: z
      .number()
      .min(1, "Must allow at least 1 guest")
      .int("Guests must be a whole number"),
    pricePerNight: z.number().min(0, "Price per night cannot be negative"),
    area: z
      .number()
      .min(1, "Area must be at least 1 square meter")
      .int("Area must be a whole number"),
    status: z.enum(["draft", "published", "archived", "maintenance"]),
    isPublic: z.boolean().default(true),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),
    minimumStay: z
      .number()
      .min(1, "Minimum stay must be at least 1 night")
      .int("Minimum stay must be a whole number")
      .optional(),
    maximumStay: z
      .number()
      .min(1, "Maximum stay must be at least 1 night")
      .int("Maximum stay must be a whole number")
      .optional(),
    contactEmail: z.string().email("Invalid email address").optional(),
    contactPhone: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    houseRules: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.minimumStay && data.maximumStay) {
        return data.minimumStay <= data.maximumStay;
      }
      return true;
    },
    {
      message: "Minimum stay must be less than or equal to maximum stay",
      path: ["minimumStay"],
    }
  );

export const propertyImagesSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File).optional(),
    })
  ),
});

export const propertySchema = propertyDataSchema.and(propertyImagesSchema);

// Export types
export type PropertyData = z.infer<typeof propertyDataSchema>;
export type PropertyImages = z.infer<typeof propertyImagesSchema>;
export type Property = z.infer<typeof propertySchema>;
