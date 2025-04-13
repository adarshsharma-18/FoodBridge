"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getCollectionsByDriver,
  getAvailableCollections,
  updateCollection,
  getDonationById,
  type Collection,
} from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"
import { OpenMapsButton } from "@/components/open-maps-button"
import { MapPin, Clock, Package, CheckCircle, Truck, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function DriverDashboard({ userName }: { userName: string }) {
  const { user } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [availablePickups, setAvailablePickups] = useState<Collection[]>([])
  const [activeTab, setActiveTab] = useState("available")
  const [collectionDetails, setCollectionDetails] = useState<Record<string, any>>({})

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = () => {
    if (!user) return

    // Load assigned collections
    const driverCollections = getCollectionsByDriver(user.id)
    setCollections(driverCollections)

    // Load available collections (requested but not assigned)
    const available = getAvailableCollections()
    setAvailablePickups(available)

    // Load donation details for all collections
    const details: Record<string, any> = {}

    // Process driver's collections
    driverCollections.forEach((collection) => {
      const donation = getDonationById(collection.donationId)
      if (donation) {
        details[collection.id] = {
          foodName: donation.foodName,
          foodType: donation.foodType,
          quantity: donation.quantity,
          address: donation.address,
          latitude: donation.latitude,
          longitude: donation.longitude,
          donorName: donation.donorName,
        }
      }
    })

    // Process available collections
    available.forEach((collection) => {
      const donation = getDonationById(collection.donationId)
      if (donation) {
        details[collection.id] = {
          foodName: donation.foodName,
          foodType: donation.foodType,
          quantity: donation.quantity,
          address: donation.address,
          latitude: donation.latitude,
          longitude: donation.longitude,
          donorName: donation.donorName,
        }
      }
    })

    setCollectionDetails(details)
  }

  const acceptPickup = (collection: Collection) => {
    if (!user) return

    const updatedCollection = {
      ...collection,
      driverId: user.id,
      driverName: userName,
      status: "assigned",
    }

    updateCollection(updatedCollection)

    // Update local state
    setAvailablePickups((prev) => prev.filter((c) => c.id !== collection.id))
    setCollections((prev) => [...prev, updatedCollection])

    // Show success message
    toast({
      title: "Pickup accepted",
      description: "You have been assigned to this pickup. Check your active pickups tab.",
    })
  }

  const updateCollectionStatus = (collection: Collection, newStatus: Collection["status"]) => {
    const updatedCollection = {
      ...collection,
      status: newStatus,
      ...(newStatus === "completed" ? { completedAt: new Date().toISOString() } : {}),
    }

    updateCollection(updatedCollection)

    // Update local state
    setCollections((prev) => prev.map((c) => (c.id === collection.id ? updatedCollection : c)))

    // Show success message
    toast({
      title: `Collection ${newStatus === "in-transit" ? "started" : "completed"}`,
      description:
        newStatus === "in-transit"
          ? "You've started the pickup. Drive safely!"
          : "The collection has been marked as delivered.",
    })
  }

  const activeCollections = collections.filter((collection) => ["assigned", "in-transit"].includes(collection.status))

  const completedCollections = collections.filter((collection) => collection.status === "completed")

  return (
    <Tabs defaultValue="available" onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-8 bg-white border rounded-lg p-1">
        <TabsTrigger value="available" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Available Pickups
          {availablePickups.length > 0 && (
            <Badge className="ml-2 bg-green-500 text-white">{availablePickups.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="active" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Active Pickups
          {activeCollections.length > 0 && (
            <Badge className="ml-2 bg-blue-500 text-white">{activeCollections.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Completed
        </TabsTrigger>
      </TabsList>

      <TabsContent value="available" className="space-y-6">
        {availablePickups.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Available Pickups</h3>
              <p className="text-gray-500 mb-6">There are no pending pickups available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          availablePickups.map((collection) => {
            const details = collectionDetails[collection.id] || {}
            return (
              <Card key={collection.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{details.foodName || "Food Collection"}</CardTitle>
                      <CardDescription>Requested by {collection.ngoName}</CardDescription>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Available</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Donation Details</p>
                        <p className="text-sm text-gray-500">Type: {details.foodType || "N/A"}</p>
                        <p className="text-sm text-gray-500">Quantity: {details.quantity || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-500">{details.address || "Address not available"}</p>
                        <p className="text-sm text-gray-500">Donor: {details.donorName || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Time</p>
                        <p className="text-sm text-gray-500">{new Date(collection.pickupTime).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {collection.notes && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-gray-500">{collection.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <OpenMapsButton
                      address={details.address || ""}
                      latitude={details.latitude}
                      longitude={details.longitude}
                      className="flex-1 mr-2"
                    />

                    <Button onClick={() => acceptPickup(collection)} className="flex-1 bg-green-600 hover:bg-green-700">
                      Accept Pickup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </TabsContent>

      <TabsContent value="active" className="space-y-6">
        {activeCollections.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Active Pickups</h3>
              <p className="text-gray-500 mb-6">You don't have any assigned pickups at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          activeCollections.map((collection) => {
            const details = collectionDetails[collection.id] || {}
            return (
              <Card key={collection.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{details.foodName || "Food Collection"}</CardTitle>
                      <CardDescription>Requested by {collection.ngoName}</CardDescription>
                    </div>
                    <Badge
                      className={
                        collection.status === "assigned" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                      }
                    >
                      {collection.status === "assigned" ? "Assigned" : "In Transit"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Donation Details</p>
                        <p className="text-sm text-gray-500">Type: {details.foodType || "N/A"}</p>
                        <p className="text-sm text-gray-500">Quantity: {details.quantity || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-500">{details.address || "Address not available"}</p>
                        <p className="text-sm text-gray-500">Donor: {details.donorName || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Time</p>
                        <p className="text-sm text-gray-500">{new Date(collection.pickupTime).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {collection.notes && (
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-gray-500">{collection.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <OpenMapsButton
                      address={details.address || ""}
                      latitude={details.latitude}
                      longitude={details.longitude}
                      className="flex-1 mr-2"
                    />

                    {collection.status === "assigned" ? (
                      <Button
                        onClick={() => updateCollectionStatus(collection, "in-transit")}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Start Pickup
                      </Button>
                    ) : (
                      <Button
                        onClick={() => updateCollectionStatus(collection, "completed")}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-6">
        {completedCollections.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Completed Deliveries</h3>
              <p className="text-gray-500 mb-6">You haven't completed any deliveries yet.</p>
            </CardContent>
          </Card>
        ) : (
          completedCollections.map((collection) => {
            const details = collectionDetails[collection.id] || {}
            return (
              <Card key={collection.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{details.foodName || "Food Collection"}</CardTitle>
                      <CardDescription>Delivered to {collection.ngoName}</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Pickup Time</p>
                      <p className="text-sm text-gray-500">{new Date(collection.pickupTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-sm text-gray-500">
                        {collection.completedAt ? new Date(collection.completedAt).toLocaleString() : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Donation</p>
                      <p className="text-sm text-gray-500">
                        {details.quantity || "N/A"} of {details.foodType || "food"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="ml-auto">
                    <OpenMapsButton
                      address={details.address || ""}
                      latitude={details.latitude}
                      longitude={details.longitude}
                      variant="ghost"
                      size="sm"
                    />
                  </Button>
                </CardFooter>
              </Card>
            )
          })
        )}
      </TabsContent>
    </Tabs>
  )
}
