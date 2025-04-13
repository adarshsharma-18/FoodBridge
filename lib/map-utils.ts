/**
 * Opens Google Maps with directions from the user's current location to a destination
 * @param destination The destination address or coordinates
 * @param isCoordinates Whether the destination is coordinates (lat,lng) or an address
 */
export const openMapsWithDirections = async (destination: string, isCoordinates = false): Promise<void> => {
  try {
    // Format the destination based on whether it's coordinates or an address
    const formattedDestination = isCoordinates ? destination : encodeURIComponent(destination)

    // Create Google Maps URL without specifying origin - Google Maps will use user's current location
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${formattedDestination}&travelmode=driving`

    // Open in a new tab
    window.open(mapsUrl, "_blank")
  } catch (error) {
    console.error("Error opening maps:", error)

    // Fallback to just opening maps with the destination
    const formattedDestination = isCoordinates ? destination : encodeURIComponent(destination)

    const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${formattedDestination}`
    window.open(fallbackUrl, "_blank")
  }
}

/**
 * Gets the user's current position
 * @returns A promise that resolves to the user's current position
 */
const getCurrentPosition = (): Promise<GeolocationPosition> => {
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
