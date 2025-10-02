"use client";

import { GoogleMapsDisplay } from "@/components/ui/google-maps-display";
import { Property } from "@/lib/properties";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation } from "lucide-react";

interface PropertyLocationDisplayProps {
  property: Property;
  className?: string;
}

export function PropertyLocationDisplay({
  property,
  className,
}: PropertyLocationDisplayProps) {
  if (!property.coordinates) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Navigation className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Map location not available for this property.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Display */}
        <GoogleMapsDisplay
          coordinates={property.coordinates}
          address={property.location}
          height="300px"
          className="border rounded-lg overflow-hidden"
        />

        {/* Location Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{property.location}</span>
          </div>

          {/* Address Details */}
          {property.addressDetails && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {property.addressDetails.streetNumber &&
                property.addressDetails.route && (
                  <div>
                    <Badge variant="outline" className="text-xs">
                      Address
                    </Badge>
                    <p className="mt-1">
                      {property.addressDetails.streetNumber}{" "}
                      {property.addressDetails.route}
                    </p>
                  </div>
                )}

              {property.addressDetails.locality && (
                <div>
                  <Badge variant="outline" className="text-xs">
                    City
                  </Badge>
                  <p className="mt-1">{property.addressDetails.locality}</p>
                </div>
              )}

              {property.addressDetails.administrativeAreaLevel1 && (
                <div>
                  <Badge variant="outline" className="text-xs">
                    Region
                  </Badge>
                  <p className="mt-1">
                    {property.addressDetails.administrativeAreaLevel1}
                  </p>
                </div>
              )}

              {property.addressDetails.country && (
                <div>
                  <Badge variant="outline" className="text-xs">
                    Country
                  </Badge>
                  <p className="mt-1">{property.addressDetails.country}</p>
                </div>
              )}
            </div>
          )}

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <Badge variant="outline" className="text-xs">
                Latitude
              </Badge>
              <p className="mt-1 font-mono text-xs">
                {property.coordinates.lat.toFixed(6)}
              </p>
            </div>
            <div>
              <Badge variant="outline" className="text-xs">
                Longitude
              </Badge>
              <p className="mt-1 font-mono text-xs">
                {property.coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
