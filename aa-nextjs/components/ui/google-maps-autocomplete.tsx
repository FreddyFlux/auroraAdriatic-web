"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const [useLegacyAPI, setUseLegacyAPI] = useState(true); // Force legacy API due to shadow DOM issues

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

          // Update the input value
          onChange(location);

          // Call the parent handler
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
    if (!window.google?.maps?.places || !containerRef.current) {
      return;
    }

    // Try to use the new PlaceAutocompleteElement first
    const tryNewAPI = (): (() => void) | null => {
      try {
        console.log("Attempting to use new PlaceAutocompleteElement API");

        // Check if PlaceAutocompleteElement is available
        if (
          typeof google.maps.places.PlaceAutocompleteElement === "undefined"
        ) {
          throw new Error("PlaceAutocompleteElement not available");
        }

        const autocompleteElement =
          new google.maps.places.PlaceAutocompleteElement({});

        console.log("PlaceAutocompleteElement created:", autocompleteElement);

        // Configure the element - try to set componentRestrictions if available
        try {
          if ("componentRestrictions" in autocompleteElement) {
            (autocompleteElement as any).componentRestrictions = {
              country: ["hr", "ba", "me", "rs", "si", "mk", "al"], // Balkan countries
            };
          }
        } catch {
          // Silently ignore - this property is not available in all API versions
        }

        // Set placeholder
        (autocompleteElement as any).placeholder = placeholder;

        // Make it look like our Input component
        autocompleteElement.style.cssText = `
          width: 100%;
          height: 2.5rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 0.875rem;
          line-height: 1.25rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        `;

        // Handle disabled state
        if (disabled) {
          (autocompleteElement as any).disabled = true;
          autocompleteElement.style.opacity = "0.5";
          autocompleteElement.style.cursor = "not-allowed";
        }

        // Add focus styles
        const addFocusStyles = () => {
          autocompleteElement.style.outline = "2px solid hsl(var(--ring))";
          autocompleteElement.style.outlineOffset = "2px";
          autocompleteElement.style.borderColor = "hsl(var(--ring))";
        };

        const removeFocusStyles = () => {
          autocompleteElement.style.outline = "none";
          autocompleteElement.style.outlineOffset = "0";
          autocompleteElement.style.borderColor = "hsl(var(--border))";
        };

        autocompleteElement.addEventListener("focus", addFocusStyles);
        autocompleteElement.addEventListener("blur", removeFocusStyles);

        // Listen for place selection - try multiple event types
        const handlePlaceSelect = (event: Event) => {
          console.log("Place selected event triggered:", event);
          const place = (event as any).place;
          console.log("Place object:", place);

          if (!place || !place.geometry || !place.geometry.location) {
            console.warn("No place details available");
            return;
          }

          const location = place.formattedAddress || "";
          const coordinates: LocationCoordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          const addressDetails = parseAddressComponents(
            place.addressComponents || [],
            place.formattedAddress
          );

          console.log("Selected location:", location);
          console.log("Coordinates:", coordinates);

          // Update the input value first
          onChange(location);

          // Call the parent handler immediately
          onPlaceSelect(location, coordinates, addressDetails);
        };

        // Try multiple event types for place selection
        autocompleteElement.addEventListener(
          "gmp-placeselect",
          handlePlaceSelect
        );
        autocompleteElement.addEventListener("placeselect", handlePlaceSelect);
        autocompleteElement.addEventListener(
          "place_changed",
          handlePlaceSelect
        );

        // Also listen for input changes to detect when user types
        const handleInputChange = (event: Event) => {
          console.log("Input change detected:", event);
          const target = event.target as HTMLInputElement;
          if (target && target.value) {
            console.log("Input value:", target.value);
            // Update React state with the typed value
            onChange(target.value);
          }
        };

        // Try to listen for input changes on the shadow DOM input
        setTimeout(() => {
          const shadowInput =
            autocompleteElement.shadowRoot?.querySelector("input");
          if (shadowInput) {
            console.log("Found shadow DOM input, adding change listener");
            shadowInput.addEventListener("input", handleInputChange);
            shadowInput.addEventListener("change", handleInputChange);
          } else {
            console.log("Could not find shadow DOM input");
          }
        }, 500);

        // Replace the fallback input with the Google Maps element
        if (containerRef.current) {
          console.log(
            "Replacing container content with PlaceAutocompleteElement"
          );
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(autocompleteElement);

          // Check if the element was actually added
          setTimeout(() => {
            const addedElement = containerRef.current?.querySelector("input");
            console.log("Element added to DOM:", addedElement);
          }, 100);
        }

        return () => {
          autocompleteElement.removeEventListener("focus", addFocusStyles);
          autocompleteElement.removeEventListener("blur", removeFocusStyles);
          autocompleteElement.removeEventListener(
            "gmp-placeselect",
            handlePlaceSelect
          );
          autocompleteElement.removeEventListener(
            "placeselect",
            handlePlaceSelect
          );
          autocompleteElement.removeEventListener(
            "place_changed",
            handlePlaceSelect
          );
        };
      } catch (error) {
        console.warn(
          "New PlaceAutocompleteElement API failed, falling back to legacy Autocomplete:",
          error
        );
        setUseLegacyAPI(true);
        return null;
      }
    };

    // Try legacy API if new API fails
    const tryLegacyAPI = (
      geocodeRef: React.MutableRefObject<((address: string) => void) | null>
    ): (() => void) | null => {
      if (!inputRef.current) {
        return null;
      }

      try {
        // Use the legacy Autocomplete API with all necessary fields
        const autocompleteOptions: google.maps.places.AutocompleteOptions = {
          fields: [
            "formatted_address",
            "geometry",
            "address_components",
            "place_id",
            "name",
            "types",
          ],
          // Remove types restriction to allow all places (businesses, landmarks, etc.)
        };

        // Try to add componentRestrictions if available
        try {
          // Check if componentRestrictions is supported in this API version
          const testOptions = { ...autocompleteOptions };
          testOptions.componentRestrictions = {
            country: ["hr", "ba", "me", "rs", "si", "mk", "al"], // Balkan countries
          };
          autocompleteOptions.componentRestrictions =
            testOptions.componentRestrictions;
        } catch {
          // Silently ignore - this property is not available in all API versions
        }

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          autocompleteOptions
        );

        // Listen for place selection
        const listener = autocompleteRef.current.addListener(
          "place_changed",
          () => {
            const place = autocompleteRef.current?.getPlace();

            // Enhanced validation for place data
            if (!place) {
              console.warn("No place data received");
              return;
            }

            if (!place.geometry || !place.geometry.location) {
              console.warn("Place missing geometry data:", place);
              return;
            }

            // Validate that we have a proper formatted address
            const location = place.formatted_address;
            if (!location || location.trim() === "") {
              console.warn("Place missing formatted address:", place);
              return;
            }

            // Validate coordinates
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            if (isNaN(lat) || isNaN(lng)) {
              console.warn("Invalid coordinates:", { lat, lng });
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

            console.log("Place selected:", {
              location,
              coordinates,
              addressDetails,
              placeId: place.place_id,
            });

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
            if (currentValue && currentValue !== value) {
              console.log("Autocomplete fallback triggered for:", currentValue);
              // Use the geocodeAddress function as fallback
              if (geocodeRef.current) {
                geocodeRef.current(currentValue);
              }
            }
          }, 100);
        };

        inputRef.current.addEventListener("blur", fallbackHandler);

        return () => {
          if (listener) {
            google.maps.event.removeListener(listener);
          }
          if (inputRef.current) {
            inputRef.current.removeEventListener("blur", fallbackHandler);
          }
        };
      } catch (error) {
        console.error("Legacy Autocomplete API also failed:", error);
        return null;
      }
    };

    // Try new API first, fallback to legacy
    let cleanup: (() => void) | null = null;

    if (!useLegacyAPI) {
      cleanup = tryNewAPI();
    }

    if (!cleanup && useLegacyAPI) {
      cleanup = tryLegacyAPI(geocodeRef);
    }

    return cleanup ?? (() => {});
  }, [
    onPlaceSelect,
    onChange,
    placeholder,
    disabled,
    useLegacyAPI,
    geocodeRef,
    value,
  ]);

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
  placeholder,
  label,
  error,
  className,
  disabled,
  showApplyButton = false,
}: GoogleMapsAutocompleteProps) {
  const geocodeRef = useRef<((address: string) => void) | null>(null);

  const handleGeocodeAddress = (geocodeFn: (address: string) => void) => {
    geocodeRef.current = geocodeFn;
  };

  const handleApplyLocation = () => {
    // Try to get the current value from multiple sources
    let currentValue = value.trim();

    // If React state is empty, try to get from the actual input element
    if (!currentValue) {
      // Try multiple selectors to find regular input elements
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

    // Also call the original onApplyLocation if provided
    if (onApplyLocation) {
      onApplyLocation();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="space-y-2">
        <Wrapper
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          libraries={["places"]}
          render={(status: Status) => {
            switch (status) {
              case Status.LOADING:
                return (
                  <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full"
                  />
                );
              case Status.FAILURE:
                return (
                  <div>
                    <Input
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder={placeholder}
                      disabled={disabled}
                      className={cn(
                        "w-full",
                        error ? "border-destructive" : ""
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Google Maps unavailable. Manual entry only.
                    </p>
                  </div>
                );
              case Status.SUCCESS:
                return (
                  <AutocompleteInput
                    value={value}
                    onChange={onChange}
                    onPlaceSelect={onPlaceSelect}
                    placeholder={placeholder}
                    disabled={disabled}
                    onGeocodeAddress={handleGeocodeAddress}
                    geocodeRef={geocodeRef}
                  />
                );
              default:
                return <div />;
            }
          }}
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
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export { GoogleMapsAutocompleteComponent as GoogleMapsAutocomplete };
