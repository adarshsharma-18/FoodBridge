// Openrouteservice API integration
const ORS_API_KEY = process.env.OPEN_ROUTE_SERVICE_API || "5b3ce3597851110001cf6248a9b268a3a0f94a0ba9fd78c1e15aac37" // Fallback to demo key

interface GeocodingResult {
  lat: number
  lng: number
  address: string
}

interface ReverseGeocodingResult {
  features: Array<{
    properties: {
      label: string
    }
    geometry: {
      coordinates: [number, number] // [longitude, latitude]
    }
  }>
}

/**
 * Check if geolocation is available in the current environment
 */
export const isGeolocationAvailable = (): boolean => {
  return typeof window !== "undefined" && "geolocation" in navigator && navigator.permissions !== undefined
}

// Update the getCurrentLocation function to provide more detailed error information
export const getCurrentLocation = (): Promise<{ lat: string; lng: string }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    // Check if we're in a secure context (HTTPS or localhost)
    if (
      typeof window !== "undefined" &&
      window.location &&
      !window.location.href.startsWith("https:") &&
      !window.location.hostname.includes("localhost")
    ) {
      reject(new Error("Geolocation requires a secure context (HTTPS)"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
        })
      },
      (error) => {
        // Provide more detailed error messages based on the error code
        let errorMessage = "Unable to retrieve your location"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable location services in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please try again later."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again."
            break
        }

        // Create a proper Error object with the message
        reject(new Error(errorMessage))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  })
}

/**
 * Geocode an address to get coordinates with fallback handling
 */
export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
  try {
    // First try with Openrouteservice
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(address)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        },
      )

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates
        return {
          lat,
          lng,
          address: data.features[0].properties.label,
        }
      }
    } catch (error) {
      console.error("Openrouteservice geocoding error:", error)
      // Continue to fallback
    }

    // Fallback to Nominatim (OpenStreetMap) if Openrouteservice fails
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "FoodBridge App", // Required by Nominatim usage policy
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      },
    )

    if (!nominatimResponse.ok) {
      throw new Error(`Nominatim geocoding failed: ${nominatimResponse.status} ${nominatimResponse.statusText}`)
    }

    const nominatimData = await nominatimResponse.json()

    if (nominatimData && nominatimData.length > 0) {
      return {
        lat: Number.parseFloat(nominatimData[0].lat),
        lng: Number.parseFloat(nominatimData[0].lon),
        address: nominatimData[0].display_name,
      }
    }

    return null
  } catch (error) {
    console.error("All geocoding methods failed:", error)
    // Return null instead of throwing to allow the application to continue
    return null
  }
}

/**
 * Reverse geocode coordinates to get address with fallback handling
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    // First try with Openrouteservice
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${lng}&point.lat=${lat}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        },
      )

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status} ${response.statusText}`)
      }

      const data: ReverseGeocodingResult = await response.json()

      if (data.features && data.features.length > 0) {
        return data.features[0].properties.label
      }
    } catch (error) {
      console.error("Openrouteservice reverse geocoding error:", error)
      // Continue to fallback
    }

    // Fallback to Nominatim (OpenStreetMap) if Openrouteservice fails
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "FoodBridge App", // Required by Nominatim usage policy
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      },
    )

    if (!nominatimResponse.ok) {
      throw new Error(`Nominatim reverse geocoding failed: ${nominatimResponse.status} ${nominatimResponse.statusText}`)
    }

    const nominatimData = await nominatimResponse.json()

    if (nominatimData && nominatimData.display_name) {
      return nominatimData.display_name
    }

    return null
  } catch (error) {
    console.error("All reverse geocoding methods failed:", error)
    // Return null instead of throwing to allow the application to continue
    return null
  }
}

/**
 * Validate if coordinates are within valid range
 */
export const validateCoordinates = (lat: string, lng: string): boolean => {
  const latNum = Number.parseFloat(lat)
  const lngNum = Number.parseFloat(lng)

  return !isNaN(latNum) && !isNaN(lngNum) && latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180
}

/**
 * Check if the API is currently available
 */
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=test`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    return response.ok
  } catch (error) {
    console.error("API availability check failed:", error)
    return false
  }
}
