import { createClient } from "next-sanity";
import { clientConfig } from "./sanity.config";

// Create Sanity client
export const client = createClient(clientConfig);

// Types for internationalized content
export interface NavigationContent {
  _id: string;
  language: string;
  home: string;
  about: string;
  contact: string;
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
