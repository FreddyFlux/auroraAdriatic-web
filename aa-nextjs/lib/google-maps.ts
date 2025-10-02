// Google Maps configuration and utilities
export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.warn(
    "Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables."
  );
}

export const GOOGLE_MAPS_LIBRARIES: (
  | "places"
  | "geometry"
  | "drawing"
  | "visualization"
)[] = ["places"];

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface AddressDetails {
  streetNumber?: string;
  route?: string;
  locality?: string;
  administrativeAreaLevel1?: string;
  country?: string;
  postalCode?: string;
  formattedAddress?: string;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export function parseAddressComponents(
  addressComponents: AddressComponent[],
  formattedAddress?: string
): AddressDetails {
  const details: AddressDetails = {
    formattedAddress,
  };

  addressComponents.forEach((component) => {
    const types = component.types;

    if (types.includes("street_number")) {
      details.streetNumber = component.long_name;
    }
    if (types.includes("route")) {
      details.route = component.long_name;
    }
    if (types.includes("locality")) {
      details.locality = component.long_name;
    }
    if (types.includes("administrative_area_level_1")) {
      details.administrativeAreaLevel1 = component.long_name;
    }
    if (types.includes("country")) {
      details.country = component.long_name;
    }
    if (types.includes("postal_code")) {
      details.postalCode = component.long_name;
    }
  });

  return details;
}

export function getLocationString(addressDetails: AddressDetails): string {
  const parts: string[] = [];

  if (addressDetails.locality) {
    parts.push(addressDetails.locality);
  }
  if (addressDetails.administrativeAreaLevel1) {
    parts.push(addressDetails.administrativeAreaLevel1);
  }
  if (addressDetails.country) {
    parts.push(addressDetails.country);
  }

  return parts.join(", ");
}
