/**
 * Opens directions in Openrouteservice with directions from the user's current location to a destination
 * @param destination The destination address or coordinates
 * @param isCoordinates Whether the destination is coordinates (lat,lng) or an address
 */
export const openMapsWithDirections = async (destination: string, isCoordinates = false): Promise<void> => {
  try {
    // Format the destination based on whether it's coordinates or an address
    const formattedDestination = isCoordinates ? destination : encodeURIComponent(destination)

    // Create Openrouteservice URL - this will open in browser and then redirect to appropriate maps app
    let mapsUrl: string

    if (isCoordinates) {
      // If we have coordinates, format them for Openrouteservice
      const [lat, lng] = destination.split(",").map((coord) => coord.trim())
      mapsUrl = `https://maps.openrouteservice.org/directions?n1=${lat}&n2=${lng}&n3=14&b=0&c=0&k1=en-US&k2=km`
    } else {
      // If we have an address, use the search endpoint
      mapsUrl = `https://maps.openrouteservice.org/search?q=${formattedDestination}`
    }

    // Open in a new tab
    window.open(mapsUrl, "_blank")
  } catch (error) {
    console.error("Error opening maps:", error)

    // Fallback to just opening a generic map search
    const fallbackUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(destination)}`
    window.open(fallbackUrl, "_blank")
  }
}

/**
 * Gets the user's current position
 * @returns A promise that resolves to the user's current position
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })
  })
}
