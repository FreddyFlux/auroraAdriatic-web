import { Suspense } from "react";
import PropertiesFilter from "@/components/properties-filter";
import PropertiesList from "@/components/properties-list";
import { getFilteredProperties, PropertyFilters } from "@/lib/properties";
import { getPropertiesByIds } from "@/lib/sanity";

interface PropertiesPageProps {
  params: { lang: string };
  searchParams: {
    search?: string;
    propertyType?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    minBedrooms?: string;
    maxBedrooms?: string;
    minBathrooms?: string;
    maxBathrooms?: string;
    minGuests?: string;
    maxGuests?: string;
    minArea?: string;
    maxArea?: string;
    status?: string;
  };
}

export default async function PropertiesPage({
  params,
  searchParams,
}: PropertiesPageProps) {
  const { lang } = await params;
  const locale = lang;

  const awaitedSearchParams = await searchParams;

  // Build filters from search params
  const filters: PropertyFilters = {
    search: awaitedSearchParams.search,
    propertyType: awaitedSearchParams.propertyType,
    location: awaitedSearchParams.location,
    minPrice: awaitedSearchParams.minPrice
      ? parseFloat(awaitedSearchParams.minPrice)
      : undefined,
    maxPrice: awaitedSearchParams.maxPrice
      ? parseFloat(awaitedSearchParams.maxPrice)
      : undefined,
    minBedrooms: awaitedSearchParams.minBedrooms
      ? parseInt(awaitedSearchParams.minBedrooms)
      : undefined,
    maxBedrooms: awaitedSearchParams.maxBedrooms
      ? parseInt(awaitedSearchParams.maxBedrooms)
      : undefined,
    minBathrooms: awaitedSearchParams.minBathrooms
      ? parseInt(awaitedSearchParams.minBathrooms)
      : undefined,
    maxBathrooms: awaitedSearchParams.maxBathrooms
      ? parseInt(awaitedSearchParams.maxBathrooms)
      : undefined,
    minGuests: awaitedSearchParams.minGuests
      ? parseInt(awaitedSearchParams.minGuests)
      : undefined,
    maxGuests: awaitedSearchParams.maxGuests
      ? parseInt(awaitedSearchParams.maxGuests)
      : undefined,
    minArea: awaitedSearchParams.minArea
      ? parseInt(awaitedSearchParams.minArea)
      : undefined,
    maxArea: awaitedSearchParams.maxArea
      ? parseInt(awaitedSearchParams.maxArea)
      : undefined,
    status: awaitedSearchParams.status,
  };

  // Fetch filtered properties from Firebase
  const firebaseProperties = await getFilteredProperties(filters);

  // Extract property IDs and fetch corresponding Sanity content
  const propertyIds = firebaseProperties.map((property) => property.id);
  const sanityProperties = await getPropertiesByIds(propertyIds, locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Discover Properties
        </h1>
        <p className="text-muted-foreground text-lg">
          Find the perfect accommodation for your Adriatic adventure
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">Loading filters...</div>
          </div>
        }
      >
        <PropertiesFilter locale={locale} />
      </Suspense>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {firebaseProperties.length}{" "}
          {firebaseProperties.length === 1 ? "property" : "properties"} found
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        }
      >
        <PropertiesList
          firebaseProperties={firebaseProperties}
          sanityProperties={sanityProperties}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
