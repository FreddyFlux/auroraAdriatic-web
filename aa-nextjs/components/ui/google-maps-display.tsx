"use client";

import { useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { cn } from "@/lib/utils";
import { LocationCoordinates } from "@/lib/google-maps";

interface GoogleMapsDisplayProps {
  coordinates: LocationCoordinates;
  address?: string;
  className?: string;
  height?: string;
  zoom?: number;
}

interface MapProps {
  coordinates: LocationCoordinates;
  address?: string;
  zoom?: number;
}

function MapComponent({ coordinates, address, zoom = 15 }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapRef_instance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    // Create map instance only once
    if (!mapRef_instance.current) {
      mapRef_instance.current = new google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    } else {
      // Update existing map center and zoom
      mapRef_instance.current.setCenter(coordinates);
      mapRef_instance.current.setZoom(zoom);
    }

    // Remove existing marker if it exists
    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    // Add new marker
    markerRef.current = new google.maps.Marker({
      position: coordinates,
      map: mapRef_instance.current,
      title: address || "Property Location",
      animation: google.maps.Animation.DROP,
    });

    // Add info window if address is provided
    if (address && markerRef.current) {
      const infoWindow = new google.maps.InfoWindow({
        content: `<div class="p-2"><strong>Property Location</strong><br>${address}</div>`,
      });

      markerRef.current.addListener("click", () => {
        infoWindow.open(mapRef_instance.current, markerRef.current);
      });
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [coordinates.lat, coordinates.lng, address, zoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef_instance.current) {
        mapRef_instance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}

function GoogleMapsDisplayComponent({
  coordinates,
  address,
  className,
  height = "300px",
  zoom = 15,
}: GoogleMapsDisplayProps) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        libraries={["places"]}
        render={(status: Status) => {
          switch (status) {
            case Status.LOADING:
              return (
                <div
                  className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center"
                  style={{ height }}
                >
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              );
            case Status.FAILURE:
              return (
                <div
                  className="w-full h-full bg-muted rounded-lg flex items-center justify-center"
                  style={{ height }}
                >
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">
                      Map unavailable
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address ||
                        `Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}`}
                    </p>
                  </div>
                </div>
              );
            case Status.SUCCESS:
              return (
                <MapComponent
                  coordinates={coordinates}
                  address={address}
                  zoom={zoom}
                />
              );
            default:
              return null;
          }
        }}
      />
    </div>
  );
}

export { GoogleMapsDisplayComponent as GoogleMapsDisplay };
