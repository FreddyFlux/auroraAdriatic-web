"use client";

import { useEffect, useRef, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AddressDetails,
  LocationCoordinates,
  parseAddressComponents,
} from "@/lib/google-maps";

interface GoogleMapsAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (
    location: string,
    coordinates: LocationCoordinates,
    addressDetails: AddressDetails
  ) => void;
  onApplyLocation?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  showApplyButton?: boolean;
}

interface AutocompleteProps {
  onPlaceSelect: (
    location: string,
    coordinates: LocationCoordinates,
    addressDetails: AddressDetails
  ) => void;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onGeocodeAddress?: (geocodeFn: (address: string) => void) => void;
  geocodeRef: React.MutableRefObject<((address: string) => void) | null>;
}

function AutocompleteInput({
  onPlaceSelect,
  value,
  onChange,
  placeholder = "Enter address",
  disabled = false,
  onGeocodeAddress,
  geocodeRef,
}: AutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Function to geocode an address and trigger onPlaceSelect
  const geocodeAddress = useCallback(
    (address: string) => {
      if (!address.trim() || !window.google?.maps) {
        return;
      }

      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: address.trim() }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const result = results[0];
          const location = result.formatted_address;
          const coordinates: LocationCoordinates = {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          };
          const addressDetails = parseAddressComponents(
            result.address_components || [],
            result.formatted_address
          );

          onChange(location);
          onPlaceSelect(location, coordinates, addressDetails);
        }
      });
    },
    [onChange, onPlaceSelect]
  );

  // Expose geocodeAddress function to parent
  useEffect(() => {
    if (onGeocodeAddress) {
      onGeocodeAddress(geocodeAddress);
    }
  }, [onGeocodeAddress, geocodeAddress]);

  useEffect(() => {
    if (!window.google?.maps?.places || !inputRef.current) {
      return;
    }

    const setupAutocomplete = (): (() => void) | null => {
      try {
        const autocompleteOptions: google.maps.places.AutocompleteOptions = {
          fields: [
            "formatted_address",
            "geometry",
            "address_components",
            "place_id",
            "name",
            "types",
          ],
        };

        // Try to add componentRestrictions if available
        try {
          const testOptions = { ...autocompleteOptions };
          testOptions.componentRestrictions = {
            country: ["hr", "ba", "me", "rs", "si", "mk", "al"], // Balkan countries
          };
          autocompleteOptions.componentRestrictions =
            testOptions.componentRestrictions;
        } catch {
          // Silently ignore - this property is not available in all API versions
        }

        if (inputRef.current) {
          autocompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            autocompleteOptions
          );
        }

        // Listen for place selection
        const listener = autocompleteRef.current?.addListener(
          "place_changed",
          () => {
            const place = autocompleteRef.current?.getPlace();

            // Validate place data
            if (!place || !place.geometry || !place.geometry.location) {
              return;
            }

            const location = place.formatted_address;
            if (!location || location.trim() === "") {
              return;
            }

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            if (isNaN(lat) || isNaN(lng)) {
              return;
            }

            const coordinates: LocationCoordinates = {
              lat: lat,
              lng: lng,
            };

            const addressDetails = parseAddressComponents(
              place.address_components || [],
              place.formatted_address
            );

            // Update the input value first
            onChange(location);

            // Call the parent handler immediately
            onPlaceSelect(location, coordinates, addressDetails);
          }
        );

        // Add a fallback listener for when autocomplete doesn't work properly
        const fallbackHandler = () => {
          // Small delay to let autocomplete process first
          setTimeout(() => {
            const currentValue = inputRef.current?.value?.trim();
            if (currentValue && currentValue !== value && geocodeRef.current) {
              geocodeRef.current(currentValue);
            }
          }, 100);
        };

        inputRef.current?.addEventListener("blur", fallbackHandler);

        return () => {
          if (listener) {
            google.maps.event.removeListener(listener);
          }
          inputRef.current?.removeEventListener("blur", fallbackHandler);
        };
      } catch (error) {
        console.error("Autocomplete API failed:", error);
        return null;
      }
    };

    const cleanup = setupAutocomplete();
    return cleanup ?? (() => {});
  }, [onPlaceSelect, onChange, placeholder, disabled, geocodeRef, value]);

  return (
    <div ref={containerRef} className="w-full">
      {/* Fallback input that gets replaced or used for legacy API */}
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}

function GoogleMapsAutocompleteComponent({
  value,
  onChange,
  onPlaceSelect,
  onApplyLocation,
  placeholder = "Enter address",
  label,
  error,
  className,
  disabled = false,
  showApplyButton = false,
}: GoogleMapsAutocompleteProps) {
  const geocodeRef = useRef<((address: string) => void) | null>(null);

  const handleGeocodeAddress = (geocodeFn: (address: string) => void) => {
    geocodeRef.current = geocodeFn;
  };

  const handleApplyLocation = () => {
    let currentValue = value.trim();

    if (!currentValue) {
      const selectors = [
        'input[placeholder="' + placeholder + '"]',
        'input[placeholder="Enter property address"]',
        'input[placeholder="Enter address"]',
        'input[type="text"]',
        "input",
      ];

      let inputElement: HTMLInputElement | null = null;
      for (const selector of selectors) {
        inputElement = document.querySelector(selector) as HTMLInputElement;
        if (inputElement && inputElement.value.trim()) {
          break;
        }
      }

      if (inputElement) {
        currentValue = inputElement.value.trim();
      }
    }

    if (geocodeRef.current && currentValue) {
      geocodeRef.current(currentValue);
    }

    if (onApplyLocation) {
      onApplyLocation();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor="address-input">{label}</Label>}

      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        libraries={["places"]}
        render={(status: Status) => {
          switch (status) {
            case Status.LOADING:
              return (
                <div className="w-full h-10 bg-muted animate-pulse rounded-md flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              );
            case Status.FAILURE:
              return (
                <div className="w-full h-10 bg-muted rounded-md flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Map service unavailable
                  </p>
                </div>
              );
            case Status.SUCCESS:
              return (
                <div className="space-y-2">
                  <AutocompleteInput
                    value={value}
                    onChange={onChange}
                    onPlaceSelect={onPlaceSelect}
                    placeholder={placeholder}
                    disabled={disabled}
                    onGeocodeAddress={handleGeocodeAddress}
                    geocodeRef={geocodeRef}
                  />
                  {showApplyButton && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleApplyLocation}
                      disabled={disabled}
                      className="w-full"
                    >
                      Apply Location
                    </Button>
                  )}
                </div>
              );
            default:
              return <div />;
          }
        }}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export { GoogleMapsAutocompleteComponent as GoogleMapsAutocomplete };
