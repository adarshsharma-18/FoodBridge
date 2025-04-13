"use client"

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { openMapsWithDirections } from "@/lib/map-utils"

interface OpenMapsButtonProps {
  address: string
  latitude?: string | number
  longitude?: string | number
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function OpenMapsButton({
  address,
  latitude,
  longitude,
  className,
  variant = "outline",
  size = "default",
}: OpenMapsButtonProps) {
  const handleOpenMaps = () => {
    if (latitude && longitude) {
      // Use coordinates if available
      openMapsWithDirections(`${latitude},${longitude}`, true)
    } else {
      // Fall back to address
      openMapsWithDirections(address)
    }
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleOpenMaps}>
      <MapPin className="mr-2 h-4 w-4" />
      Open in Maps
    </Button>
  )
}
