"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface MapLocationPickerProps {
  onLocationSelect: (lat: string, lng: string, address: string) => void
  initialAddress?: string
  initialLat?: string
  initialLng?: string
}

export function MapLocationPicker({
  onLocationSelect,
  initialAddress,
  initialLat,
  initialLng,
}: MapLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [apiLoaded, setApiLoaded] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [address, setAddress] = useState(initialAddress || "")
  const [manualCoords, setManualCoords] = useState({
    lat: initialLat || "",
    lng: initialLng || "",
  })

  // This function will be called when the Google Maps API is loaded
  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    try {
      const initialLatLng = {
        lat: initialLat ? Number.parseFloat(initialLat) : 40.7128,
        lng: initialLng ? Number.parseFloat(initialLng) : -74.006,
      }

      const map = new window.google.maps.Map(mapRef.current, {
        center: initialLatLng,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      })

      const marker = new window.google.maps.Marker({
        position: initialLatLng,
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      })

      const geocoder = new window.google.maps.Geocoder()

      // Get address from initial coordinates
      if (initialLat && initialLng) {
        geocoder.geocode({ location: initialLatLng }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            setAddress(results[0].formatted_address)
            onLocationSelect(initialLatLng.lat.toString(), initialLatLng.lng.toString(), results[0].formatted_address)
          }
        })
      }

      // Update marker position and get address when map is clicked
      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        const latLng = e.latLng
        if (!latLng) return

        marker.setPosition(latLng)

        geocoder.geocode({ location: { lat: latLng.lat(), lng: latLng.lng() } }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            setAddress(results[0].formatted_address)
            onLocationSelect(latLng.lat().toString(), latLng.lng().toString(), results[0].formatted_address)
          }
        })
      })

      // Update address when marker is dragged
      marker.addListener("dragend", () => {
        const position = marker.getPosition()
        if (!position) return

        geocoder.geocode({ location: { lat: position.lat(), lng: position.lng() } }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            setAddress(results[0].formatted_address)
            onLocationSelect(position.lat().toString(), position.lng().toString(), results[0].formatted_address)
          }
        })
      })

      // Create search box
      const input = document.getElementById("map-search-input") as HTMLInputElement
      if (input) {
        const searchBox = new window.google.maps.places.SearchBox(input)

        // Bias the SearchBox results towards current map's viewport
        map.addListener("bounds_changed", () => {
          searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds)
        })

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place
        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces()

          if (!places || places.length === 0) return

          const place = places[0]

          if (!place.geometry || !place.geometry.location) return

          // If the place has a geometry, then present it on a map
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport)
          } else {
            map.setCenter(place.geometry.location)
            map.setZoom(17)
          }

          marker.setPosition(place.geometry.location)

          setAddress(place.formatted_address || "")
          onLocationSelect(
            place.geometry.location.lat().toString(),
            place.geometry.location.lng().toString(),
            place.formatted_address || "",
          )
        })
      }

      setMapLoaded(true)
    } catch (error) {
      console.error("Error initializing map:", error)
      setApiError(true)
    }
  }

  // Handle manual address and coordinates input
  const handleManualInput = () => {
    if (address) {
      onLocationSelect(manualCoords.lat || "0", manualCoords.lng || "0", address)
    }
  }

  // Load Google Maps API
  useEffect(() => {
    // Check if API is already loaded
    if (window.google && window.google.maps) {
      setApiLoaded(true)
      return
    }

    // This function will be called when the Google Maps API script is loaded
    window.initMap = () => {
      setApiLoaded(true)
    }

    // Create script element to load Google Maps API
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`
    script.async = true
    script.defer = true

    // Handle script load error
    script.onerror = () => {
      console.error("Google Maps API failed to load")
      setApiError(true)
    }

    document.head.appendChild(script)

    // Set a timeout to check if the API loaded successfully
    const timeoutId = setTimeout(() => {
      if (!window.google || !window.google.maps) {
        setApiError(true)
      }
    }, 5000)

    return () => {
      // Clean up
      window.initMap = undefined
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      clearTimeout(timeoutId)
    }
  }, [])

  // Initialize map when API is loaded
  useEffect(() => {
    if (apiLoaded && !mapLoaded && !apiError) {
      initializeMap()
    }
  }, [apiLoaded, mapLoaded, apiError])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          id="map-search-input"
          placeholder="Search for a location"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="pl-10"
        />
        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      </div>

      {apiError ? (
        <div className="space-y-4">
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Google Maps could not be loaded. Please enter your address and coordinates manually.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Textarea
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                placeholder="Latitude (optional)"
                value={manualCoords.lat}
                onChange={(e) => setManualCoords({ ...manualCoords, lat: e.target.value })}
              />
              <p className="text-xs text-gray-500">e.g., 40.7128</p>
            </div>
            <div className="space-y-1">
              <Input
                placeholder="Longitude (optional)"
                value={manualCoords.lng}
                onChange={(e) => setManualCoords({ ...manualCoords, lng: e.target.value })}
              />
              <p className="text-xs text-gray-500">e.g., -74.0060</p>
            </div>
          </div>

          <Button type="button" onClick={handleManualInput} className="w-full">
            Save Location
          </Button>
        </div>
      ) : (
        <div ref={mapRef} className="h-64 w-full rounded-md bg-gray-100 relative">
          {!apiLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input type="hidden" name="latitude" value={initialLat || manualCoords.lat || ""} />
      <input type="hidden" name="longitude" value={initialLng || manualCoords.lng || ""} />
    </div>
  )
}

// Add this to make TypeScript happy with the global window object
declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}
