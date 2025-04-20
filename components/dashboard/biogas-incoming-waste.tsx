"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getWasteDonationsForBiogasPlant, approveDonationByBiogasPlant, type Donation } from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle, Clock, MapPin, Package } from "lucide-react"
import { OpenMapsButton } from "@/components/open-maps-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BiogasIncomingWaste() {
  const { user } = useAuth()
  const [wasteDonations, setWasteDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pickupDate, setPickupDate] = useState("")

  useEffect(() => {
    if (user) {
      loadWasteDonations()
    }
  }, [user])

  const loadWasteDonations = () => {
    if (!user) return

    const donations = getWasteDonationsForBiogasPlant(user.id)
    setWasteDonations(donations)
    setLoading(false)
  }

  const handleApproveClick = (donation: Donation) => {
    setSelectedDonation(donation)
    // Set default pickup date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setPickupDate(tomorrow.toISOString().split("T")[0])
    setDialogOpen(true)
  }

  const handleApprove = () => {
    if (!user || !selectedDonation) return

    try {
      // Approve the donation
      const updatedDonation = approveDonationByBiogasPlant(selectedDonation.id, user.id, user.name)

      if (updatedDonation) {
        // Update the local state
        setWasteDonations((prev) => prev.map((d) => (d.id === selectedDonation.id ? updatedDonation : d)))

        // Show success message
        toast({
          title: "Waste donation approved",
          description: "The donation has been approved and will be assigned to a driver.",
          type: "success",
        })
      }
    } catch (error) {
      console.error("Error approving donation:", error)
      toast({
        title: "Error",
        description: "Failed to approve the donation. Please try again.",
        type: "error",
      })
    }

    // Close dialog
    setDialogOpen(false)
    setSelectedDonation(null)
  }

  // Get status badge color and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "awaiting_biogas_approval":
        return { color: "bg-amber-100 text-amber-800", text: "Awaiting Approval" }
      case "biogas_approved":
        return { color: "bg-green-100 text-green-800", text: "Approved" }
      case "driver_accepted":
        return { color: "bg-blue-100 text-blue-800", text: "Driver Assigned" }
      case "collected":
        return { color: "bg-purple-100 text-purple-800", text: "Collected" }
      case "delivered":
        return { color: "bg-green-100 text-green-800", text: "Delivered" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: status }
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading waste donations...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Incoming Waste Donations</h2>
        <Button onClick={loadWasteDonations} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      {wasteDonations.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Incoming Waste</h3>
            <p className="text-gray-500 mb-6">There are no waste donations awaiting your review at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        wasteDonations.map((donation) => {
          const statusBadge = getStatusBadge(donation.status)
          const needsApproval = donation.status === "awaiting_biogas_approval"

          return (
            <Card key={donation.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{donation.foodName}</CardTitle>
                    <CardDescription>From {donation.donorName}</CardDescription>
                  </div>
                  <Badge className={statusBadge.color}>{statusBadge.text}</Badge>
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
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Donation Time</p>
                      <p className="text-sm text-gray-500">{new Date(donation.createdAt).toLocaleString()}</p>
                      {donation.reviewedAt && (
                        <p className="text-sm text-gray-500">
                          Approved: {new Date(donation.reviewedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {donation.description && (
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm font-medium">Additional Notes</p>
                    <p className="text-sm text-gray-500">{donation.description}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <OpenMapsButton
                    address={donation.address}
                    latitude={donation.latitude}
                    longitude={donation.longitude}
                    variant="outline"
                  />

                  {needsApproval && (
                    <Button onClick={() => handleApproveClick(donation)} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Waste Donation
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Approve Waste Donation</DialogTitle>
            <DialogDescription>
              Approve this waste donation to make it available for drivers to pick up.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pickup-date" className="col-span-4">
                Preferred Pickup Date
              </Label>
              <Input
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="col-span-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>Approve Donation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
