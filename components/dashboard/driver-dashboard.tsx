"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Package, CheckCircle, Truck, AlertCircle, Leaf, Camera } from "lucide-react"
import {
  getCollectionsByDriver,
  getAvailableCollections,
  updateCollection,
  getDonationById,
  updateDonation,
  type Collection,
  type Donation,
  getAvailableWastePickups,
} from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"
import { OpenMapsButton } from "@/components/open-maps-button"
import { toast } from "@/components/ui/use-toast"
import { PhotoVerificationModal } from "@/components/driver/photo-verification-modal"
import { determineDestination } from "@/lib/ml-service"
import { notifyNGO, notifyBiogasPlant, notifyDriver } from "@/lib/notification-service"
import { PhotoModal } from "@/components/photo-modal"
import { getImagesByAssociatedId } from "@/lib/image-storage"

interface DriverDashboardProps {
  userName: string
}

export function DriverDashboard({ userName }: DriverDashboardProps) {
  const { user } = useAuth()
  const [collections, setCollections] = useState<any[]>([])
  const [availablePickups, setAvailablePickups] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("available")
  const [collectionDetails, setCollectionDetails] = useState<Record<string, any>>({})

  // Photo verification state
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [verificationPhotos, setVerificationPhotos] = useState<Record<string, string>>({})
  const [verificationResults, setVerificationResults] = useState<Record<string, "edible" | "expired" | "inedible">>({})
  const [verificationImageIds, setVerificationImageIds] = useState<Record<string, string>>({})
  const [mlConfidences, setMlConfidences] = useState<Record<string, number>>({})

  // Photo viewer state
  const [viewPhotoModalOpen, setViewPhotoModalOpen] = useState(false)
  const [viewPhotoUrl, setViewPhotoUrl] = useState("")

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

    // Load available waste pickups
    const availableWaste = getAvailableWastePickups ? getAvailableWastePickups() : []

    // Combine regular and waste pickups
    const allAvailablePickups = [...available, ...availableWaste]
    setAvailablePickups(allAvailablePickups)

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
          donationType: donation.donationType || "regular",
          wasteCondition: donation.wasteCondition,
          originalNgoId: collection.ngoId,
          originalNgoName: collection.ngoName,
        }
      }

      // Load verification photos for this collection
      const images = getImagesByAssociatedId(collection.id)
      if (images.length > 0) {
        // Use the most recent verification photo
        const verificationImage = images.sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
        )[0]

        setVerificationPhotos((prev) => ({
          ...prev,
          [collection.id]: verificationImage.url,
        }))

        setVerificationImageIds((prev) => ({
          ...prev,
          [collection.id]: verificationImage.id,
        }))

        // If ML assessment is available, use it
        if (verificationImage.metadata?.mlAssessment) {
          setVerificationResults((prev) => ({
            ...prev,
            [collection.id]: verificationImage.metadata?.mlAssessment?.condition || "edible",
          }))

          setMlConfidences((prev) => ({
            ...prev,
            [collection.id]: verificationImage.metadata?.mlAssessment?.confidence || 0,
          }))
        }
      }
    })

    // Process available collections
    allAvailablePickups.forEach((collection) => {
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
          donationType: donation.donationType || "regular",
          wasteCondition: donation.wasteCondition,
          originalNgoId: collection.ngoId,
          originalNgoName: collection.ngoName,
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

    const success = updateCollection(updatedCollection)

    if (success) {
      // Update local state
      setAvailablePickups((prev) => prev.filter((c) => c.id !== collection.id))
      setCollections((prev) => [...prev, updatedCollection])

      // Show success message
      toast({
        title: "Pickup accepted",
        description: "You have been assigned to this pickup. Check your active pickups tab.",
      })
    } else {
      toast({
        title: "Error accepting pickup",
        description: "There was an issue with storage. Please try again.",
        type: "error",
      })
    }
  }

  const startPickup = (collection: Collection) => {
    // Open photo verification modal
    setSelectedCollection(collection)
    setPhotoModalOpen(true)
  }

  const handleVerificationComplete = async (
    condition: "edible" | "expired" | "inedible",
    photoUrl: string,
    imageId: string,
    mlConfidence: number,
  ) => {
    if (!selectedCollection || !user) return

    // Store verification result
    setVerificationPhotos((prev) => ({
      ...prev,
      [selectedCollection.id]: photoUrl,
    }))

    setVerificationResults((prev) => ({
      ...prev,
      [selectedCollection.id]: condition,
    }))

    setVerificationImageIds((prev) => ({
      ...prev,
      [selectedCollection.id]: imageId,
    }))

    setMlConfidences((prev) => ({
      ...prev,
      [selectedCollection.id]: mlConfidence,
    }))

    // Determine destination based on condition
    const destination = determineDestination(condition)
    const details = collectionDetails[selectedCollection.id] || {}
    const isRedirected = destination === "biogas" && details.donationType !== "waste"

    // Update collection status to in-transit
    const updatedCollection: Collection = {
      ...selectedCollection,
      status: "in-transit",
      // Store verification details - use image ID instead of full data URL
      verificationImageId: imageId,
      verificationResult: condition,
      // If food is not edible and original destination was NGO, redirect to biogas
      ...(isRedirected && {
        originalNgoId: selectedCollection.ngoId,
        originalNgoName: selectedCollection.ngoName,
        ngoId: "biogas_plant",
        ngoName: "Biogas Plant Facility",
      }),
    }

    const success = updateCollection(updatedCollection)

    if (success) {
      // Update donation if needed
      if (isRedirected) {
        const donation = getDonationById(selectedCollection.donationId)
        if (donation) {
          const updatedDonation: Donation = {
            ...donation,
            donationType: "waste",
            wasteCondition: condition === "expired" ? "edible" : "inedible",
            status: "driver_accepted", // Mark as accepted by driver for biogas
          }
          updateDonation(updatedDonation)
        }

        // Notify relevant parties
        notifyNGO(details.originalNgoId || selectedCollection.ngoId, selectedCollection.donationId, condition, true)
        notifyBiogasPlant("biogas_plant", selectedCollection.donationId, condition)
        notifyDriver(user.id, selectedCollection.donationId, "biogas")
      } else {
        // If not redirected, just notify the original recipient
        notifyNGO(selectedCollection.ngoId, selectedCollection.donationId, condition, false)
        notifyDriver(user.id, selectedCollection.donationId, destination)
      }

      // Update local state
      setCollections((prev) => prev.map((c) => (c.id === selectedCollection.id ? updatedCollection : c)))

      // Show success message
      toast({
        title: "Pickup started",
        description: `Food condition verified as ${condition}. ${isRedirected ? "Redirected to biogas plant." : ""}`,
      })
    } else {
      toast({
        title: "Storage error",
        description: "There was an issue saving the verification data. Please try again.",
        type: "error",
      })
    }

    // Reset selected collection
    setSelectedCollection(null)
  }

  const completeDelivery = (collection: Collection) => {
    const updatedCollection = {
      ...collection,
      status: "completed",
      completedAt: new Date().toISOString(),
    }

    const success = updateCollection(updatedCollection)

    if (success) {
      // Update local state
      setCollections((prev) => prev.map((c) => (c.id === collection.id ? updatedCollection : c)))

      // Show success message
      toast({
        title: "Delivery completed",
        description: "The collection has been marked as delivered.",
        type: "success",
      })
    } else {
      toast({
        title: "Storage error",
        description: "There was an issue updating the delivery status. Please try again.",
        type: "error",
      })
    }
  }

  const viewPhoto = (photoUrl: string) => {
    setViewPhotoUrl(photoUrl)
    setViewPhotoModalOpen(true)
  }

  const activeCollections = collections.filter((collection) => ["assigned", "in-transit"].includes(collection.status))

  const completedCollections = collections.filter((collection) => collection.status === "completed")

  // Get condition badge color
  const getConditionBadge = (condition: "edible" | "expired" | "inedible") => {
    switch (condition) {
      case "edible":
        return { color: "bg-green-100 text-green-800", text: "Edible" }
      case "expired":
        return { color: "bg-amber-100 text-amber-800", text: "Expired" }
      case "inedible":
        return { color: "bg-red-100 text-red-800", text: "Inedible" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Unknown" }
    }
  }

  return (
    <>
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
              const isWaste = details.donationType === "waste"

              return (
                <Card
                  key={collection.id}
                  className={`border-none shadow-md hover:shadow-lg transition-shadow ${isWaste ? "border-l-4 border-amber-500" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {details.foodName || "Food Collection"}
                          {isWaste && <Leaf className="ml-2 h-4 w-4 text-amber-500" />}
                        </CardTitle>
                        <CardDescription>
                          {isWaste ? "Waste Food for Biogas Plant" : `Requested by ${collection.ngoName}`}
                        </CardDescription>
                      </div>
                      <Badge className={isWaste ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                        {isWaste ? "Waste Pickup" : "Available"}
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
                          {isWaste && (
                            <p className="text-sm text-amber-600 font-medium">
                              Condition: {details.wasteCondition || "N/A"}
                            </p>
                          )}
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
                          <p className="text-sm text-gray-500">
                            {new Date(collection.pickupTime || Date.now()).toLocaleString()}
                          </p>
                          {isWaste && <p className="text-sm text-amber-600">Priority: High</p>}
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

                      <Button
                        onClick={() => acceptPickup(collection)}
                        className={`flex-1 ${isWaste ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}`}
                      >
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
              const isWaste = details.donationType === "waste"
              const isRedirected = collection.originalNgoId && collection.originalNgoName
              const verificationResult = verificationResults[collection.id]
              const verificationPhoto = verificationPhotos[collection.id]
              const mlConfidence = mlConfidences[collection.id] || 0

              return (
                <Card
                  key={collection.id}
                  className={`border-none shadow-md hover:shadow-lg transition-shadow ${isWaste ? "border-l-4 border-amber-500" : ""} ${isRedirected ? "border-l-4 border-red-500" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {details.foodName || "Food Collection"}
                          {isWaste && <Leaf className="ml-2 h-4 w-4 text-amber-500" />}
                          {isRedirected && <AlertCircle className="ml-2 h-4 w-4 text-red-500" />}
                        </CardTitle>
                        <CardDescription>
                          {isRedirected
                            ? `Redirected to Biogas Plant (Originally for ${details.originalNgoName || collection.originalNgoName})`
                            : isWaste
                              ? "Waste Food for Biogas Plant"
                              : `Requested by ${collection.ngoName}`}
                        </CardDescription>
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
                          {(isWaste || verificationResult) && (
                            <div className="mt-1">
                              {verificationResult && (
                                <Badge className={getConditionBadge(verificationResult).color}>
                                  {getConditionBadge(verificationResult).text}
                                  {mlConfidence > 0 && (
                                    <span className="ml-1 text-xs">({Math.round(mlConfidence * 100)}%)</span>
                                  )}
                                </Badge>
                              )}
                              {!verificationResult && isWaste && (
                                <p className="text-sm text-amber-600 font-medium">
                                  Condition: {details.wasteCondition || "N/A"}
                                </p>
                              )}
                            </div>
                          )}
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
                          <p className="font-medium">{isWaste || isRedirected ? "Destination" : "Delivery Location"}</p>
                          <p className="text-sm text-gray-500">
                            {isWaste || isRedirected ? "Biogas Plant Facility" : collection.ngoName}
                          </p>
                          {(isWaste || isRedirected) && <p className="text-sm text-amber-600">Priority: High</p>}
                        </div>
                      </div>
                    </div>

                    {verificationPhoto && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Verification Photo</p>
                        <div
                          className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                          onClick={() => viewPhoto(verificationPhoto)}
                        >
                          <img
                            src={verificationPhoto || "/placeholder.svg"}
                            alt="Food verification"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all">
                            <div className="opacity-0 hover:opacity-100 text-white">Click to view</div>
                          </div>
                        </div>
                      </div>
                    )}

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
                          onClick={() => startPickup(collection)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Camera className="mr-2 h-4 w-4" /> Verify & Start Pickup
                        </Button>
                      ) : (
                        <Button
                          onClick={() => completeDelivery(collection)}
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
              const isWaste = details.donationType === "waste"
              const isRedirected = collection.originalNgoId && collection.originalNgoName
              const verificationResult = verificationResults[collection.id]
              const verificationPhoto = verificationPhotos[collection.id]

              return (
                <Card
                  key={collection.id}
                  className={`border-none shadow-sm hover:shadow-md transition-shadow ${isWaste ? "border-l-4 border-amber-500" : ""} ${isRedirected ? "border-l-4 border-red-500" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {details.foodName || "Food Collection"}
                          {isWaste && <Leaf className="ml-2 h-4 w-4 text-amber-500" />}
                          {isRedirected && <AlertCircle className="ml-2 h-4 w-4 text-red-500" />}
                        </CardTitle>
                        <CardDescription>
                          {isRedirected
                            ? `Redirected to Biogas Plant (Originally for ${details.originalNgoName || collection.originalNgoName})`
                            : isWaste
                              ? "Waste Food for Biogas Plant"
                              : `Delivered to ${collection.ngoName}`}
                        </CardDescription>
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
                          {verificationResult && (
                            <Badge className={`ml-2 ${getConditionBadge(verificationResult).color}`}>
                              {getConditionBadge(verificationResult).text}
                            </Badge>
                          )}
                        </p>
                      </div>
                    </div>

                    {verificationPhoto && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Verification Photo</p>
                        <div
                          className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                          onClick={() => viewPhoto(verificationPhoto)}
                        >
                          <img
                            src={verificationPhoto || "/placeholder.svg"}
                            alt="Food verification"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all">
                            <div className="opacity-0 hover:opacity-100 text-white">Click to view</div>
                          </div>
                        </div>
                      </div>
                    )}
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

      {/* Photo Verification Modal */}
      {user && selectedCollection && (
        <PhotoVerificationModal
          isOpen={photoModalOpen}
          onClose={() => setPhotoModalOpen(false)}
          onVerificationComplete={handleVerificationComplete}
          donationDetails={{
            foodName: selectedCollection ? collectionDetails[selectedCollection.id]?.foodName || "" : "",
            foodType: selectedCollection ? collectionDetails[selectedCollection.id]?.foodType || "" : "",
          }}
          userId={user.id}
          collectionId={selectedCollection.id}
        />
      )}

      {/* Photo Viewer Modal */}
      <PhotoModal
        isOpen={viewPhotoModalOpen}
        onClose={() => setViewPhotoModalOpen(false)}
        photoUrl={viewPhotoUrl}
        alt="Food verification photo"
      />
    </>
  )
}
