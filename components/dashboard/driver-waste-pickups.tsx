"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAvailableWasteDonationsForDrivers, acceptWasteDonationByDriver, type Donation } from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Clock, MapPin, Package, Truck } from "lucide-react"
import { OpenMapsButton } from "@/components/open-maps-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DriverWastePickups() {
  const { user } = useAuth()
  const [wasteDonations, setWasteDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadWasteDonations()
  }, [])

  const loadWasteDonations = () => {
    const donations = getAvailableWasteDonationsForDrivers()
    setWasteDonations(donations)
    setLoading(false)
  }

  const handleAcceptClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setDialogOpen(true)
  }

  const handleAccept = () => {
    if (!user || !selectedDonation) return

    try {
      // Accept the donation
      const updatedDonation = acceptWasteDonationByDriver(selectedDonation.id, user.id, user.name)

      if (updatedDonation) {
        // Update the local state
        setWasteDonations((prev) => prev.filter((d) => d.id !== selectedDonation.id))

        // Show success message
        toast({
          title: "Pickup accepted",
          description: "You have been assigned to this waste pickup.",
          type: "success",
        })
      }
    } catch (error) {
      console.error("Error accepting pickup:", error)
      toast({
        title: "Error",
        description: "Failed to accept the pickup. Please try again.",
        type: "error",
      })
    }

    // Close dialog
    setDialogOpen(false)
    setSelectedDonation(null)
  }

  if (loading) {
    return <div className="text-center py-8">Loading available waste pickups...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Available Waste Pickups</h2>
        <Button onClick={loadWasteDonations} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {wasteDonations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Available Pickups</h3>
            <p className="text-gray-500 mb-6">There are no waste pickups available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        wasteDonations.map((donation) => (
          <Card key={donation.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{donation.foodName}</CardTitle>
                  <CardDescription>For {donation.biogasPlantName}</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Ready for Pickup</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start">
                  <Package className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Waste Details</p>
                    <p className="text-sm text-gray-500">Type: {donation.foodType}</p>
                    <p className="text-sm text-gray-500">Quantity: {donation.quantity}</p>
                    <p className="text-sm text-gray-500">
                      Condition: {donation.wasteCondition === "edible" ? "Edible but expired" : "Inedible"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Pickup Location</p>
                    <p className="text-sm text-gray-500">{donation.address}</p>
                    <p className="text-sm text-gray-500">From: {donation.donorName}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Timing</p>
                    <p className="text-sm text-gray-500">
                      Approved: {new Date(donation.reviewedAt || "").toLocaleString()}
                    </p>
                    {donation.pickupScheduledFor && (
                      <p className="text-sm text-gray-500">
                        Scheduled for: {new Date(donation.pickupScheduledFor).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <OpenMapsButton
                  address={donation.address}
                  latitude={donation.latitude}
                  longitude={donation.longitude}
                  variant="outline"
                />

                <Button onClick={() => handleAcceptClick(donation)} className="bg-green-600 hover:bg-green-700">
                  <Truck className="mr-2 h-4 w-4" />
                  Accept Pickup
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Accept Waste Pickup</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this waste pickup? You will be responsible for collecting and delivering
              it to the biogas plant.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAccept}>Accept Pickup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
