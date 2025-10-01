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
        images[0] {
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
        images[0] {
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

// Generate image URL from Sanity asset reference
export function getSanityImageUrl(
  image: SanityImage,
  width: number = 400,
  height: number = 300
): string {
  if (!image?.asset?._ref) return "";

  const baseUrl = "https://cdn.sanity.io/images/9az93sif/production/";
  const assetId = image.asset._ref
    .replace("image-", "")
    .replace("-jpg", ".jpg")
    .replace("-png", ".png")
    .replace("-webp", ".webp");

  return `${baseUrl}${assetId}?w=${width}&h=${height}&fit=crop&crop=${image.hotspot ? "focalpoint" : "center"}`;
}
