"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAvailableDonations, addCollection, updateDonation, type Donation, type Collection } from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"
import { OpenMapsButton } from "@/components/open-maps-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export function AvailableDonations() {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [pickupTime, setPickupTime] = useState("")
  const [notes, setNotes] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // Fetch available donations
    const availableDonations = getAvailableDonations()
    setDonations(availableDonations)
    setLoading(false)
  }, [])

  const handleCollectClick = (donation: Donation) => {
    setSelectedDonation(donation)
    // Set default pickup time to 2 hours from now
    const defaultPickupTime = new Date(Date.now() + 2 * 60 * 60 * 1000)
    setPickupTime(defaultPickupTime.toISOString().slice(0, 16)) // Format for datetime-local input
    setNotes("")
    setDialogOpen(true)
  }

  const handleCollect = () => {
    if (!user || !selectedDonation) return

    // Create a new collection request
    const newCollection: Collection = {
      id: `col_${Date.now()}`,
      donationId: selectedDonation.id,
      ngoId: user.id,
      ngoName: user.name,
      pickupTime: pickupTime || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      notes: notes || "No additional notes",
      status: "requested", // Initial status is "requested" - waiting for a driver to accept
      createdAt: new Date().toISOString(),
    }

    // Add to collections
    addCollection(newCollection)

    // Update the donation status
    updateDonation({
      ...selectedDonation,
      status: "assigned",
      assignedTo: user.id,
    })

    // Remove from available donations
    setDonations((prev) => prev.filter((d) => d.id !== selectedDonation.id))

    // Close dialog and reset form
    setDialogOpen(false)
    setSelectedDonation(null)
    setPickupTime("")
    setNotes("")

    // Show success message
    toast({
      title: "Donation claimed successfully",
      description: "A driver will be assigned to pick up this donation soon.",
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading available donations...</div>
  }

  if (donations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No available donations found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {donations.map((donation) => (
          <Card key={donation.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle>{donation.foodName}</CardTitle>
                <Badge>{donation.foodType}</Badge>
              </div>
              <CardDescription>{donation.donorName}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="grid gap-2">
                <div>
                  <p className="text-sm font-medium">Quantity</p>
                  <p className="text-sm text-muted-foreground">{donation.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Condition</p>
                  <p className="text-sm text-muted-foreground">{donation.condition}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{donation.address}</p>
                </div>
                {donation.expiryDate && (
                  <div>
                    <p className="text-sm font-medium">Expiry</p>
                    <p className="text-sm text-muted-foreground">{new Date(donation.expiryDate).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <OpenMapsButton address={donation.address} latitude={donation.latitude} longitude={donation.longitude} />

              {user && (user.role === "ngo" || user.role === "admin") && (
                <Button onClick={() => handleCollectClick(donation)}>Claim Donation</Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Claim Donation</DialogTitle>
            <DialogDescription>
              Provide pickup details for this donation. A driver will be assigned to collect it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pickup-time" className="col-span-4">
                Preferred Pickup Time
              </Label>
              <Input
                id="pickup-time"
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="col-span-4"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="col-span-4">
                Additional Notes (Optional)
              </Label>
              <Input
                id="notes"
                placeholder="Any special instructions for pickup"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCollect}>Claim Donation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
