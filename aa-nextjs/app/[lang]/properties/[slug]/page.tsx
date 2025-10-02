import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import { getPropertyByPropertyId } from "@/lib/sanity";
import { getSanityImageUrl } from "@/lib/sanity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Users,
  MapPin,
  Calendar,
  Wifi,
  Car,
  Coffee,
  Home,
  Star,
} from "lucide-react";

interface PropertyPageProps {
  params: { lang: string; slug: string };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { lang, slug } = await params;
  const locale = lang;

  // Fetch property from Firebase
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Fetch Sanity content
  const sanityProperty = await getPropertyByPropertyId(property.id, locale);

  if (!sanityProperty) {
    notFound();
  }

  const displayTitle = sanityProperty.titleTranslation || property.title;
  const displayDescription =
    sanityProperty.shortDescription || property.description;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Images */}
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              {sanityProperty.images?.[0] ? (
                <img
                  src={getSanityImageUrl(sanityProperty.images[0], 800, 600)}
                  alt={sanityProperty.images[0].alt || displayTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {/* Additional Images */}
            {sanityProperty.images && sanityProperty.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sanityProperty.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={getSanityImageUrl(image, 200, 200)}
                      alt={image.alt || `${displayTitle} - Image ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {displayTitle}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                {sanityProperty.catchphrase}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-semibold">{property.guests}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Area</p>
                  <p className="font-semibold">{property.area}m²</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                About this property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {displayDescription}
              </p>
            </div>

            {/* Highlights */}
            {sanityProperty.highlights &&
              sanityProperty.highlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Property highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sanityProperty.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{highlight.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {highlight.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Amenities */}
            {sanityProperty.amenities &&
              sanityProperty.amenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sanityProperty.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                        </div>
                        <span className="text-sm">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    €{property.pricePerNight}
                  </p>
                  <p className="text-sm text-muted-foreground">per night</p>
                </div>
                <Badge variant="secondary">{property.propertyType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Check-in</span>
                  <span>{property.checkInTime || "3:00 PM"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Check-out</span>
                  <span>{property.checkOutTime || "11:00 AM"}</span>
                </div>
                {property.minimumStay && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Minimum stay</span>
                    <span>{property.minimumStay} nights</span>
                  </div>
                )}
              </div>
              <Button className="w-full" size="lg">
                Book Now
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                You won't be charged yet
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {property.contactEmail && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Email:</span>
                  <a
                    href={`mailto:${property.contactEmail}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {property.contactEmail}
                  </a>
                </div>
              )}
              {property.contactPhone && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Phone:</span>
                  <a
                    href={`tel:${property.contactPhone}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {property.contactPhone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* House Rules */}
          {sanityProperty.houseRules &&
            sanityProperty.houseRules.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sanityProperty.houseRules.map((rule, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{rule.title}:</span>{" "}
                        <span className="text-muted-foreground">
                          {rule.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
