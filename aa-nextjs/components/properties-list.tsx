import MainCard from "./main-card";
import { getSanityImageUrl, SanityProperty } from "@/lib/sanity";
import { Property } from "@/lib/properties";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Users, Home, MapPin, Star } from "lucide-react";

interface PropertiesListProps {
  firebaseProperties: Property[];
  sanityProperties: SanityProperty[];
  locale: string;
}

export default function PropertiesList({
  firebaseProperties,
  sanityProperties,
  locale,
}: PropertiesListProps) {
  // Create a map of Sanity properties by propertyId for quick lookup
  const sanityPropertyMap = new Map(
    sanityProperties.map((property) => [property.propertyId, property])
  );

  // Merge Firebase and Sanity data
  const mergedProperties = firebaseProperties.map((fbProperty) => {
    const sanityProperty = sanityPropertyMap.get(fbProperty.id);
    return {
      firebase: fbProperty,
      sanity: sanityProperty,
    };
  });

  if (mergedProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No properties found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      style={{ gridAutoRows: "1fr" }}
    >
      {mergedProperties.map(({ firebase, sanity }) => (
        <div key={firebase.id} className="flex flex-col h-full">
          <MainCard
            title={sanity?.titleTranslation || firebase.title}
            titleDescription={sanity?.catchphrase || `${firebase.location}`}
            contentText={
              sanity?.shortDescription ||
              firebase.description.substring(0, 100) + "..."
            }
            buttonText="View Details"
            image={sanity?.images?.[0]}
            imageUrl={
              sanity?.images?.[0]
                ? getSanityImageUrl(sanity.images[0])
                : undefined
            }
            href={`/${locale}/properties/${firebase.slug}`}
            badge={
              <Badge variant="secondary" className="capitalize">
                {firebase.propertyType}
              </Badge>
            }
            footer={
              <div className="space-y-3">
                {/* Property Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{firebase.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{firebase.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{firebase.guests}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span>{firebase.area}m²</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{firebase.location}</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">
                      €{firebase.pricePerNight}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /night
                    </span>
                  </div>
                  {sanity?.featured === "yes" && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">Featured</span>
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
}
