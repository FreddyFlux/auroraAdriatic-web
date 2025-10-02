# Google Maps Integration Setup

This document explains how to set up Google Maps integration for the property location features.

## Prerequisites

1. A Google Cloud Platform account
2. A project in Google Cloud Console
3. Billing enabled on your Google Cloud project

## Step 1: Enable Required APIs

In your Google Cloud Console, enable the following APIs:

1. **Places API (New)** - For the new PlaceAutocompleteElement functionality
2. **Maps JavaScript API** - For displaying maps
3. **Geocoding API** - For converting addresses to coordinates

**Important:** Make sure to enable the **Places API (New)** which is required for the new `PlaceAutocompleteElement` API that we're using.

### How to enable APIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Library"
4. Search for each API and click "Enable"

## Step 2: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 3: Restrict API Key (Recommended)

For security, restrict your API key:

1. Click on your API key to edit it
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain(s):
     ```
     localhost:3000/*
     localhost:3001/*
     127.0.0.1:3000/*
     yourdomain.com/*
     *.yourdomain.com/*
     ```
3. Under "API restrictions":
   - For development: Select "Don't restrict key" (easier setup)
   - For production: Select "Restrict key" and choose:
     - Places API (New)
     - Maps JavaScript API
     - Geocoding API

**Important:** Make sure to include `localhost:3000/*` for development!

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root and add:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your actual API key from Step 2.

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to the property creation form
3. Go to the "Location" tab
4. Start typing an address in the location field
5. You should see Google Maps autocomplete suggestions
6. Select an address and verify the map displays correctly

## Features Included

### 1. Address Autocomplete

- Uses the new Google Maps `PlaceAutocompleteElement` API (recommended over deprecated Autocomplete)
- Type-ahead address suggestions
- Restricted to Balkan countries (Croatia, Bosnia, Montenegro, Serbia, Slovenia, North Macedonia, Albania)
- Automatic coordinate extraction
- Detailed address parsing (street, city, country, etc.)

### 2. Interactive Map Display

- Real-time map preview when address is selected
- Property marker with clickable info window
- Responsive design with customizable height
- Fallback display when maps fail to load

### 3. Data Storage

- Coordinates (latitude/longitude)
- Detailed address components
- Formatted address string
- Integration with existing property schema

## Troubleshooting

### Maps not loading

- Check that your API key is correctly set in `.env.local`
- Verify that Maps JavaScript API is enabled
- Check browser console for error messages
- Ensure your domain is added to API key restrictions
- **RefererNotAllowedMapError**: Add `localhost:3000/*` to your API key referrer restrictions

### Autocomplete not working

- Verify **Places API (New)** is enabled (not just the old Places API)
- Check that your API key has Places API access
- Look for CORS errors in browser console
- Ensure you're using the new `PlaceAutocompleteElement` API
- **ApiTargetBlockedMapError**: Remove API restrictions or add Places API to allowed APIs

### Billing issues

- Google Maps requires billing to be enabled
- Check your Google Cloud billing settings
- Monitor usage in the Google Cloud Console

## Cost Considerations

Google Maps pricing is based on usage:

- **Places API**: $0.017 per autocomplete session
- **Maps JavaScript API**: $7 per 1,000 map loads
- **Geocoding API**: $5 per 1,000 requests

For development, you get $200 in free credits monthly.

## Security Best Practices

1. **Restrict your API key** to specific domains
2. **Use environment variables** for API keys
3. **Monitor usage** regularly in Google Cloud Console
4. **Set up billing alerts** to avoid unexpected charges
5. **Never commit API keys** to version control

## Support

If you encounter issues:

1. Check the [Google Maps Platform documentation](https://developers.google.com/maps/documentation)
2. Review the browser console for error messages
3. Verify your API key configuration
4. Test with a simple address first (e.g., "Dubrovnik, Croatia")
