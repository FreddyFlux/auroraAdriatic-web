"use client";

import { useState, useEffect } from "react";
import { GoogleMapsAutocomplete } from "@/components/ui/google-maps-autocomplete";
import { GoogleMapsDisplay } from "@/components/ui/google-maps-display";
import { LocationCoordinates, AddressDetails } from "@/lib/google-maps";
import { cn } from "@/lib/utils";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (coordinates: LocationCoordinates | null) => void;
  onAddressDetailsChange?: (addressDetails: AddressDetails | null) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  showMap?: boolean;
  showApplyButton?: boolean;
  mapHeight?: string;
  mapZoom?: number;
  initialCoordinates?: LocationCoordinates | null;
}

export function LocationInput({
  value,
  onChange,
  onCoordinatesChange,
  onAddressDetailsChange,
  placeholder = "Enter location",
  label,
  error,
  className,
  disabled = false,
  showMap = true,
  showApplyButton = false,
  mapHeight = "300px",
  mapZoom = 15,
  initialCoordinates = null,
}: LocationInputProps) {
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<LocationCoordinates | null>(initialCoordinates);
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(
    null
  );

  // Initialize coordinates from props
  useEffect(() => {
    if (initialCoordinates && !selectedCoordinates) {
      setSelectedCoordinates(initialCoordinates);
    }
  }, [initialCoordinates, selectedCoordinates]);

  const handlePlaceSelect = (
    location: string,
    coordinates: LocationCoordinates,
    details: AddressDetails
  ) => {
    onChange(location);
    setSelectedCoordinates(coordinates);
    setAddressDetails(details);

    if (onCoordinatesChange) {
      onCoordinatesChange(coordinates);
    }

    if (onAddressDetailsChange) {
      onAddressDetailsChange(details);
    }
  };

  const handleApplyLocation = () => {
    // Force map update by clearing and resetting coordinates
    setSelectedCoordinates(null);
    setTimeout(() => {
      if (selectedCoordinates) {
        setSelectedCoordinates(selectedCoordinates);
      }
    }, 100);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <GoogleMapsAutocomplete
        value={value}
        onChange={onChange}
        onPlaceSelect={handlePlaceSelect}
        onApplyLocation={handleApplyLocation}
        placeholder={placeholder}
        label={label}
        error={error}
        disabled={disabled}
        showApplyButton={showApplyButton}
      />

      {showMap && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Location Preview
          </h4>
          {selectedCoordinates ? (
            <GoogleMapsDisplay
              coordinates={selectedCoordinates}
              address={value}
              height={mapHeight}
              zoom={mapZoom}
            />
          ) : (
            <div
              className="border rounded-lg bg-muted flex items-center justify-center"
              style={{ height: mapHeight }}
            >
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  Select an address to see the map
                </p>
                <p className="text-xs text-muted-foreground">
                  The map will appear here once you choose a location
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
