"use client"

import { useEffect, useState } from "react"
import { MapPin, AlertCircle, Locate, CheckCircle, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  getCurrentLocation,
  geocodeAddress,
  reverseGeocode,
  validateCoordinates,
  checkApiAvailability,
} from "@/lib/location-service"

// Fallback coordinates for when geolocation fails
const FALLBACK_COORDINATES = {
  NEW_YORK: { lat: "40.7128", lng: "-74.0060" },
  LONDON: { lat: "51.5074", lng: "-0.1278" },
  TOKYO: { lat: "35.6762", lng: "139.6503" },
  SYDNEY: { lat: "-33.8688", lng: "151.2093" },
}

interface LocationPickerProps {
  onLocationSelect: (lat: string, lng: string, address: string) => void
  initialAddress?: string
  initialLat?: string
  initialLng?: string
}

export function LocationPicker({ onLocationSelect, initialAddress, initialLat, initialLng }: LocationPickerProps) {
  const [address, setAddress] = useState(initialAddress || "")
  const [coordinates, setCoordinates] = useState({
    lat: initialLat || "",
    lng: initialLng || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const [manualMode, setManualMode] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Check if we're in preview mode and if geolocation is available
  useEffect(() => {
    // Check if we're in a preview environment or iframe
    const isPreview =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("preview") ||
        window !== window.parent) // Check if in iframe

    if (isPreview) {
      setIsPreviewMode(true)
      setManualMode(true)
      setError(
        "Geolocation may not work in preview mode due to security restrictions. Please enter your address manually.",
      )
    }
  }, [])

  // Check API availability on component mount
  useEffect(() => {
    const checkApi = async () => {
      const isAvailable = await checkApiAvailability()
      setApiAvailable(isAvailable)
      if (!isAvailable) {
        setManualMode(true)
        setError("Location service is currently unavailable. You can enter your address manually.")
      }
    }
    checkApi()
  }, [])

  // Initialize with initial values if provided
  useEffect(() => {
    if (initialLat && initialLng && initialAddress) {
      setCoordinates({ lat: initialLat, lng: initialLng })
      setAddress(initialAddress)
      // Validate the coordinates
      if (validateCoordinates(initialLat, initialLng)) {
        setSuccess("Location data loaded successfully")
      }
    }
  }, [initialLat, initialLng, initialAddress])

  const useFallbackLocation = () => {
    // Select a random fallback location
    const fallbackLocations = Object.values(FALLBACK_COORDINATES)
    const randomLocation = fallbackLocations[Math.floor(Math.random() * fallbackLocations.length)]

    setCoordinates({
      lat: randomLocation.lat,
      lng: randomLocation.lng,
    })

    // Set a generic address
    const genericAddress = "Example Location (Please update)"
    setAddress(genericAddress)

    onLocationSelect(randomLocation.lat, randomLocation.lng, genericAddress)
    setSuccess("Using example location. Please update with your actual address.")
    setManualMode(true)
  }

  // Handle address search
  const handleAddressSearch = async () => {
    if (!address) {
      setError("Please enter an address to search")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await geocodeAddress(address)

      if (result) {
        setCoordinates({
          lat: result.lat.toString(),
          lng: result.lng.toString(),
        })
        setAddress(result.address)
        onLocationSelect(result.lat.toString(), result.lng.toString(), result.address)
        setSuccess("Address found and coordinates updated")
      } else {
        // If geocoding fails but we have an address, still allow proceeding
        setError(
          "Could not find exact coordinates for this address. You can proceed with the address as entered or try a different one.",
        )
        // Clear coordinates but keep the address
        setCoordinates({ lat: "", lng: "" })
        // Still call onLocationSelect with empty coordinates
        onLocationSelect("", "", address)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error searching for address"
      setError(`${errorMessage}. You can proceed with the address as entered.`)
      // Still call onLocationSelect with empty coordinates
      onLocationSelect("", "", address)
    } finally {
      setIsLoading(false)
    }
  }

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const position = await getCurrentLocation()

      setCoordinates({
        lat: position.lat,
        lng: position.lng,
      })

      // Get address from coordinates
      try {
        const address = await reverseGeocode(Number(position.lat), Number(position.lng))

        if (address) {
          setAddress(address)
          onLocationSelect(position.lat, position.lng, address)
          setSuccess("Current location detected successfully")
        } else {
          // If reverse geocoding fails, use generic address
          const genericAddress = `Location at ${position.lat}, ${position.lng}`
          setAddress(genericAddress)
          onLocationSelect(position.lat, position.lng, genericAddress)
          setSuccess("Location coordinates detected, but couldn't get exact address")
        }
      } catch (reverseErr) {
        // If reverse geocoding fails, still use the coordinates
        const genericAddress = `Location at ${position.lat}, ${position.lng}`
        setAddress(genericAddress)
        onLocationSelect(position.lat, position.lng, genericAddress)
        setError("Got your location, but couldn't determine the exact address. You can proceed with the coordinates.")
      }
    } catch (err) {
      console.error("Geolocation error:", err)

      // Handle different error types
      let errorMessage = "Could not get your current location"

      if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === "string") {
        errorMessage = err
      } else if (err && typeof err === "object") {
        // Try to extract useful information from the error object
        errorMessage = JSON.stringify(err)
      }

      setError(`Location error: ${errorMessage}`)
      setManualMode(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle manual coordinate input
  const handleManualCoordinateChange = (field: "lat" | "lng", value: string) => {
    setCoordinates((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Save manual inputs
  const handleSaveManualInput = () => {
    setError(null)
    setSuccess(null)

    // If we have an address but no coordinates, that's okay
    if (address) {
      // If we have coordinates, validate them
      if (coordinates.lat && coordinates.lng) {
        if (validateCoordinates(coordinates.lat, coordinates.lng)) {
          onLocationSelect(coordinates.lat, coordinates.lng, address)
          setSuccess("Location saved successfully")
        } else {
          setError("Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180.")
          return
        }
      } else {
        // No coordinates, but we have an address
        onLocationSelect("", "", address)
        setSuccess("Address saved. No coordinates provided.")
      }
    } else {
      setError("Please provide at least an address.")
    }
  }

  // Toggle between manual and automatic modes
  const toggleManualMode = () => {
    setManualMode(!manualMode)
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="space-y-4">
      {/* Preview mode warning */}
      {isPreviewMode && (
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium">Preview Mode Detected</p>
            <p>Geolocation is disabled in preview environments due to security restrictions. Please:</p>
            <ol className="list-decimal ml-5 mt-1 text-sm">
              <li>Enter your address manually in the field below</li>
              <li>Use the "Search" button to find coordinates</li>
              <li>Or enter coordinates directly in the manual input fields</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}

      {/* Address input and search */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pl-10"
            disabled={isLoading}
          />
          <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        <Button type="button" onClick={handleAddressSearch} disabled={isLoading || !address} variant="outline">
          {isLoading ? "Searching..." : "Search"}
        </Button>
        <Button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLoading || apiAvailable === false || isPreviewMode}
          variant="outline"
          title={isPreviewMode ? "Geolocation is disabled in preview mode" : "Use my current location"}
        >
          <Locate className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          onClick={useFallbackLocation}
          variant="outline"
          className="hidden md:flex"
          title="Use an example location"
        >
          Use Example
        </Button>
      </div>

      {/* Error and success messages */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Manual mode toggle */}
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={toggleManualMode} className="text-sm">
          {manualMode ? "Hide manual coordinates" : "Enter coordinates manually"}
        </Button>
      </div>

      {/* Manual coordinate inputs */}
      {manualMode && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Input
              placeholder="Latitude"
              value={coordinates.lat}
              onChange={(e) => handleManualCoordinateChange("lat", e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">e.g., 40.7128 (between -90 and 90)</p>
          </div>
          <div className="space-y-1">
            <Input
              placeholder="Longitude"
              value={coordinates.lng}
              onChange={(e) => handleManualCoordinateChange("lng", e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">e.g., -74.0060 (between -180 and 180)</p>
          </div>
        </div>
      )}

      {/* API status message */}
      {apiAvailable === false && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Location service is currently unavailable. You can still enter your address manually.
          </AlertDescription>
        </Alert>
      )}

      {/* Guidance message */}
      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-800">
          {address
            ? "Your address has been entered. You can proceed even without exact coordinates."
            : "Please provide your address for pickup location. Using your exact coordinates helps drivers find you more easily."}
        </p>
      </div>

      {/* Save button */}
      <Button type="button" onClick={handleSaveManualInput} className="w-full" disabled={isLoading || !address}>
        Save Location
      </Button>

      {/* Hidden inputs for form submission */}
      <input type="hidden" name="latitude" value={coordinates.lat} />
      <input type="hidden" name="longitude" value={coordinates.lng} />
      <input type="hidden" name="address" value={address} />
    </div>
  )
}
