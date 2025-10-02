import { firestore } from "@/firebase/server";
import { client } from "@/lib/sanity";
import slugify from "slugify";

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  addressDetails?: {
    streetNumber?: string;
    route?: string;
    locality?: string;
    administrativeAreaLevel1?: string;
    country?: string;
    postalCode?: string;
    formattedAddress?: string;
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  pricePerNight: number;
  area: number;
  status: string;
  isPublic: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  minimumStay?: number;
  maximumStay?: number;
  contactEmail?: string;
  contactPhone?: string;
  amenities?: string[];
  houseRules?: string[];
  created: Date;
  updated: Date;
}

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
  images?: Array<{
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
  }>;
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

export interface PropertyFilters {
  search?: string;
  propertyType?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minGuests?: number;
  maxGuests?: number;
  minArea?: number;
  maxArea?: number;
  status?: string;
  featured?: boolean;
}

export const getProperties = async (): Promise<Property[]> => {
  try {
    const snapshot = await firestore
      .collection("properties")
      .where("isPublic", "==", true)
      .orderBy("created", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created: doc.data().created.toDate(),
      updated: doc.data().updated.toDate(),
    })) as Property[];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
};

export const getFilteredProperties = async (
  filters: PropertyFilters
): Promise<Property[]> => {
  try {
    // Start with base query - fetch all public properties
    // We'll do filtering on the client side to avoid Firestore composite index requirements
    const snapshot = await firestore
      .collection("properties")
      .where("isPublic", "==", true)
      .orderBy("created", "desc")
      .get();

    let properties = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created: doc.data().created.toDate(),
      updated: doc.data().updated.toDate(),
    })) as Property[];

    // Apply property type filter
    if (filters.propertyType && filters.propertyType !== "all") {
      properties = properties.filter(
        (property) => property.propertyType === filters.propertyType
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== "all") {
      properties = properties.filter(
        (property) => property.status === filters.status
      );
    }

    // Apply location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      properties = properties.filter((property) =>
        property.location.toLowerCase().includes(locationLower)
      );
    }

    // Apply price filters
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      properties = properties.filter(
        (property) => property.pricePerNight >= filters.minPrice!
      );
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      properties = properties.filter(
        (property) => property.pricePerNight <= filters.maxPrice!
      );
    }

    // Apply bedroom filters
    if (filters.minBedrooms !== undefined && filters.minBedrooms > 0) {
      properties = properties.filter(
        (property) => property.bedrooms >= filters.minBedrooms!
      );
    }
    if (filters.maxBedrooms !== undefined && filters.maxBedrooms > 0) {
      properties = properties.filter(
        (property) => property.bedrooms <= filters.maxBedrooms!
      );
    }

    // Apply bathroom filters
    if (filters.minBathrooms !== undefined && filters.minBathrooms > 0) {
      properties = properties.filter(
        (property) => property.bathrooms >= filters.minBathrooms!
      );
    }
    if (filters.maxBathrooms !== undefined && filters.maxBathrooms > 0) {
      properties = properties.filter(
        (property) => property.bathrooms <= filters.maxBathrooms!
      );
    }

    // Apply guest filters
    if (filters.minGuests !== undefined && filters.minGuests > 0) {
      properties = properties.filter(
        (property) => property.guests >= filters.minGuests!
      );
    }
    if (filters.maxGuests !== undefined && filters.maxGuests > 0) {
      properties = properties.filter(
        (property) => property.guests <= filters.maxGuests!
      );
    }

    // Apply area filters
    if (filters.minArea !== undefined && filters.minArea > 0) {
      properties = properties.filter(
        (property) => property.area >= filters.minArea!
      );
    }
    if (filters.maxArea !== undefined && filters.maxArea > 0) {
      properties = properties.filter(
        (property) => property.area <= filters.maxArea!
      );
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      // This would need to be handled differently since featured is in Sanity
      // For now, we'll skip this filter or implement it after fetching Sanity data
    }

    // Apply client-side search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      properties = properties.filter(
        (property) =>
          property.title.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.location.toLowerCase().includes(searchLower)
      );
    }

    return properties;
  } catch (error) {
    console.error("Error fetching filtered properties:", error);
    return [];
  }
};

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const snapshot = await firestore
      .collection("properties")
      .orderBy("created", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created: doc.data().created.toDate(),
      updated: doc.data().updated.toDate(),
    })) as Property[];
  } catch (error) {
    console.error("Error fetching all properties:", error);
    return [];
  }
};

export const getPropertyById = async (
  propertyId: string
): Promise<Property | null> => {
  try {
    const doc = await firestore.collection("properties").doc(propertyId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      created: data.created.toDate(),
      updated: data.updated.toDate(),
    } as Property;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
};

export const getPropertyBySlug = async (
  slug: string
): Promise<Property | null> => {
  try {
    const snapshot = await firestore
      .collection("properties")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created: data.created.toDate(),
      updated: data.updated.toDate(),
    } as Property;
  } catch (error) {
    console.error("Error fetching property by slug:", error);
    return null;
  }
};

export const generateSlug = (title: string): string => {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

export const isSlugUnique = async (
  slug: string,
  excludePropertyId?: string
): Promise<boolean> => {
  try {
    const snapshot = await firestore
      .collection("properties")
      .where("slug", "==", slug)
      .get();

    if (excludePropertyId) {
      // For updates, exclude the current property
      return snapshot.docs.every((doc) => doc.id !== excludePropertyId);
    } else {
      // For new properties, check if any documents exist
      return snapshot.empty;
    }
  } catch (error) {
    console.error("Error checking slug uniqueness:", error);
    return false;
  }
};

export const getSanityPropertyByPropertyId = async (
  propertyId: string
): Promise<SanityProperty | null> => {
  try {
    const query = `*[_type == "property" && propertyId == "${propertyId}"][0]`;
    const property = await client.fetch(query);
    return property;
  } catch (error) {
    console.error("Error fetching Sanity property:", error);
    return null;
  }
};

export const getPropertiesByIds = async (
  propertyIds: string[],
  locale: string
): Promise<SanityProperty[]> => {
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
      images,
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
};

export const getPropertiesWithSanityContent = async (): Promise<
  (Property & { sanityContent?: SanityProperty | null })[]
> => {
  try {
    const properties = await getProperties();
    const propertiesWithContent = await Promise.all(
      properties.map(async (property) => {
        const sanityContent = await getSanityPropertyByPropertyId(property.id);
        return {
          ...property,
          sanityContent,
        };
      })
    );
    return propertiesWithContent;
  } catch (error) {
    console.error("Error fetching properties with Sanity content:", error);
    return [];
  }
};

// deleteProperty function moved to API route: /api/properties/[propertyId]/route.ts
