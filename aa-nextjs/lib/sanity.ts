import { createClient } from "next-sanity";
import { clientConfig } from "./sanity.config";

// Create Sanity client for read operations
export const client = createClient(clientConfig);

// Create Sanity client for write operations (optional - requires SANITY_API_TOKEN)
export const writeClient = process.env.SANITY_API_TOKEN
  ? createClient({
      ...clientConfig,
      token: process.env.SANITY_API_TOKEN,
      useCdn: false, // Always use live data for write operations
    })
  : null;

// Types for internationalized content
export interface NavigationContent {
  _id: string;
  language: string;
  home: string;
  about: string;
  contact: string;
}

// Types for Sanity event data
export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanityEvent {
  _id: string;
  _type: "event";
  _lang: string;
  _i18n?: {
    base: string;
    translations: string[];
  };
  eventId: string;
  location: string;
  title: string;
  titleTranslation: string;
  catchphrase: string;
  shortDescription: string;
  featured: "yes" | "no";
  description?: any[]; // Rich text content
  images?: SanityImage[];
  highlights?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  itinerary?: Array<{
    day: number;
    title: string;
    activities: Array<{
      time: string;
      activity: string;
      description: string;
    }>;
  }>;
  included?: string[];
  notIncluded?: string[];
  requirements?: Array<{
    title: string;
    description: string;
    mandatory: boolean;
  }>;
  testimonials?: Array<{
    name: string;
    rating: number;
    text: string;
    date: string;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

// Fetch navigation content for a specific locale
export async function getNavigationContent(
  locale: string
): Promise<NavigationContent | null> {
  try {
    const query = `*[_type == "navigation" && language == $locale][0]`;
    const params = { locale };

    return await client.fetch(query, params);
  } catch (error) {
    console.error("Error fetching navigation content:", error);
    return null;
  }
}

// Fetch all available locales for navigation
export async function getAvailableLocales(): Promise<string[]> {
  try {
    const query = `array::unique(*[_type == "navigation"].language)`;
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching available locales:", error);
    return ["en"]; // Fallback to English
  }
}

// Fetch featured events for a specific locale
export async function getFeaturedEvents(
  locale: string
): Promise<SanityEvent[]> {
  try {
    const query = `
      *[_type == "event" && coalesce(_lang, language) == $locale && featured == "yes"] | order(_createdAt desc) [0...3] {
        _id,
        _lang,
        eventId,
        location,
        title,
        titleTranslation,
        catchphrase,
        shortDescription,
        featured,
        images[] {
          _type,
          asset,
          alt,
          caption,
          hotspot
        }
      }
    `;
    const params = { locale };

    return await client.fetch(query, params);
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
}

// Fetch all events for a specific locale
export async function getEvents(locale: string): Promise<SanityEvent[]> {
  try {
    const query = `
      *[_type == "event" && coalesce(_lang, language) == $locale] | order(_createdAt desc) {
        _id,
        _lang,
        eventId,
        location,
        title,
        titleTranslation,
        catchphrase,
        shortDescription,
        featured,
        images[] {
          _type,
          asset,
          alt,
          caption,
          hotspot
        }
      }
    `;
    const params = { locale };

    return await client.fetch(query, params);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

// Fetch events by Firebase event IDs
export async function getEventsByIds(
  eventIds: string[],
  locale: string
): Promise<SanityEvent[]> {
  try {
    if (eventIds.length === 0) return [];

    const query = `
      *[_type == "event" && eventId in $eventIds && coalesce(_lang, language) == $locale] {
        _id,
        _lang,
        eventId,
        location,
        title,
        titleTranslation,
        catchphrase,
        shortDescription,
        featured,
        images[] {
          _type,
          asset,
          alt,
          caption,
          hotspot
        }
      }
    `;
    const params = { eventIds, locale };

    return await client.fetch(query, params);
  } catch (error) {
    console.error("Error fetching events by IDs:", error);
    return [];
  }
}

// Fetch a single event by eventId with locale support and all fields
export async function getEventByEventId(
  eventId: string,
  locale: string
): Promise<SanityEvent | null> {
  try {
    const query = `
      *[_type == "event" && eventId == $eventId && coalesce(_lang, language) == $locale][0] {
        _id,
        _type,
        _lang,
        _i18n,
        eventId,
        location,
        title,
        titleTranslation,
        catchphrase,
        shortDescription,
        featured,
        description,
        images[] {
          _type,
          asset,
          alt,
          caption,
          hotspot
        },
        highlights,
        itinerary,
        included,
        notIncluded,
        requirements,
        testimonials,
        seo
      }
    `;
    const params = { eventId, locale };

    return await client.fetch(query, params);
  } catch (error) {
    console.error("Error fetching event by eventId:", error);
    return null;
  }
}

// Generate image URL from Sanity asset reference
export function getSanityImageUrl(
  image: SanityImage,
  width: number = 400,
  height: number = 300
): string {
  if (!image?.asset?._ref) {
    return "";
  }

  const baseUrl = "https://cdn.sanity.io/images/9az93sif/production/";

  // Extract the asset ID and format from the reference
  const assetRef = image.asset._ref;

  // Remove the "image-" prefix and get the file extension
  let assetId = assetRef.replace("image-", "");

  // Handle different file formats
  if (assetId.includes("-jpg")) {
    assetId = assetId.replace("-jpg", ".jpg");
  } else if (assetId.includes("-png")) {
    assetId = assetId.replace("-png", ".png");
  } else if (assetId.includes("-webp")) {
    assetId = assetId.replace("-webp", ".webp");
  } else if (assetId.includes("-jpeg")) {
    assetId = assetId.replace("-jpeg", ".jpeg");
  } else {
    // Default to jpg if no format is specified
    assetId = assetId + ".jpg";
  }

  const imageUrl = `${baseUrl}${assetId}?w=${width}&h=${height}&fit=crop&crop=${image.hotspot ? "focalpoint" : "center"}`;

  return imageUrl;
}

// Property-related interfaces and functions
export interface SanityProperty {
  _id: string;
  _type: "property";
  _lang: string;
  _i18n?: {
    base: string;
    translations: string[];
  };
  propertyId: string;
  title: string;
  titleTranslation: string;
  location: string;
  catchphrase: string;
  shortDescription: string;
  featured: "yes" | "no";
  description?: any[]; // Rich text content
  images?: SanityImage[];
  highlights?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  amenities?: Array<{
    category: string;
    name: string;
    description?: string;
  }>;
  included?: string[];
  notIncluded?: string[];
  houseRules?: Array<{
    title: string;
    description: string;
    mandatory: boolean;
  }>;
  testimonials?: Array<{
    name: string;
    rating: number;
    text: string;
    date: string;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

// Fetch properties by IDs for a specific locale
export async function getPropertiesByIds(
  propertyIds: string[],
  locale: string
): Promise<SanityProperty[]> {
  try {
    if (propertyIds.length === 0) return [];

    const query = `*[_type == "property" && propertyId in $propertyIds && _lang == $locale] {
      _id,
      _type,
      _lang,
      _i18n,
      propertyId,
      title,
      titleTranslation,
      location,
      catchphrase,
      shortDescription,
      featured,
      description,
      images[] {
        _type,
        asset,
        alt,
        caption,
        hotspot
      },
      highlights,
      amenities,
      included,
      notIncluded,
      houseRules,
      testimonials,
      seo
    }`;

    const properties = await client.fetch(query, {
      propertyIds,
      locale,
    });

    return properties;
  } catch (error) {
    console.error("Error fetching properties by IDs:", error);
    return [];
  }
}

// Fetch featured properties for a specific locale
export async function getFeaturedProperties(
  locale: string
): Promise<SanityProperty[]> {
  try {
    const query = `
      *[_type == "property" && coalesce(_lang, language) == $locale && featured == "yes"] | order(_createdAt desc) [0...3] {
        _id,
        _lang,
        propertyId,
        location,
        title,
        titleTranslation,
        catchphrase,
        shortDescription,
        featured,
        images[] {
          _type,
          asset,
          alt,
          caption,
          hotspot
        },
        highlights,
        amenities,
        included,
        notIncluded,
        houseRules,
        testimonials,
        seo
      }
    `;
    const params = { locale };

    return await client.fetch(query, params);
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
}

// Fetch property by propertyId for a specific locale
export async function getPropertyByPropertyId(
  propertyId: string,
  locale: string
): Promise<SanityProperty | null> {
  try {
    const query = `
      *[_type == "property" && propertyId == $propertyId && _lang == $locale][0] {
        _id,
        _type,
        _lang,
        _i18n,
        propertyId,
        title,
        titleTranslation,
        location,
        catchphrase,
        shortDescription,
        featured,
        description,
        images[] {
          _type,
          asset,
          alt,
          caption,
          hotspot
        },
        highlights,
        amenities,
        included,
        notIncluded,
        houseRules,
        testimonials,
        seo
      }
    `;
    const params = { propertyId, locale };

    return await client.fetch(query, params);
  } catch (error) {
    console.error("Error fetching property by propertyId:", error);
    return null;
  }
}
