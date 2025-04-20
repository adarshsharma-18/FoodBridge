"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDonationById } from "@/lib/storage"
import { getImagesByAssociatedId } from "@/lib/image-storage"
import { ImageGallery } from "@/components/image-gallery"
import { MapPin, Calendar, Package, AlertCircle } from "lucide-react"
import { OpenMapsButton } from "@/components/open-maps-button"

export default function DonationDetailPage() {
  const params = useParams()
  const donationId = params.id as string
  const [donation, setDonation] = useState<any>(null)
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (donationId) {
      // Load donation details
      const donationData = getDonationById(donationId)
      setDonation(donationData || null)

      // Load associated images
      if (donationData) {
        const donationImages = getImagesByAssociatedId(donationId)
        setImages(donationImages)
      }

      setLoading(false)
    }
  }, [donationId])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!donation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Donation Not Found</h3>
            <p className="text-gray-500 mb-6">The donation you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { color: "bg-amber-100 text-amber-800", text: "Pending" }
      case "assigned":
        return { color: "bg-blue-100 text-blue-800", text: "Assigned" }
      case "collected":
        return { color: "bg-purple-100 text-purple-800", text: "Collected" }
      case "delivered":
        return { color: "bg-green-100 text-green-800", text: "Delivered" }
      case "awaiting_biogas_approval":
        return { color: "bg-amber-100 text-amber-800", text: "Awaiting Biogas Approval" }
      case "biogas_approved":
        return { color: "bg-blue-100 text-blue-800", text: "Biogas Approved" }
      case "driver_accepted":
        return { color: "bg-purple-100 text-purple-800", text: "Driver Accepted" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: status }
    }
  }

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "fresh":
        return { color: "bg-green-100 text-green-800", text: "Fresh" }
      case "good":
        return { color: "bg-blue-100 text-blue-800", text: "Good" }
      case "staple":
        return { color: "bg-amber-100 text-amber-800", text: "Staple" }
      default:
        return { color: "bg-gray-100 text-gray-800", text: condition }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">{donation.foodName}</CardTitle>
                    <CardDescription>Donation ID: {donation.id}</CardDescription>
                  </div>
                  <Badge className={getStatusBadge(donation.status).color}>
                    {getStatusBadge(donation.status).text}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Donation Images */}
                {images.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Donation Images</h3>
                    <ImageGallery images={images} associatedId={donationId} />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Donation Details</p>
                        <p className="text-sm text-gray-500">Type: {donation.foodType}</p>
                        <p className="text-sm text-gray-500">Quantity: {donation.quantity}</p>
                        <div className="mt-1">
                          <Badge className={getConditionBadge(donation.condition).color}>
                            {getConditionBadge(donation.condition).text}
                          </Badge>
                          {donation.donationType === "waste" && (
                            <Badge className="ml-2 bg-red-100 text-red-800">
                              Waste Food ({donation.wasteCondition})
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Dates</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(donation.createdAt).toLocaleString()}
                        </p>
                        {donation.expiryDate && (
                          <p className="text-sm text-gray-500">
                            Expires: {new Date(donation.expiryDate).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-500">{donation.address}</p>
                        <p className="text-sm text-gray-500">Donor: {donation.donorName}</p>
                        <div className="mt-2">
                          <OpenMapsButton
                            address={donation.address}
                            latitude={donation.latitude}
                            longitude={donation.longitude}
                            variant="outline"
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {donation.description && (
                  <div className="mt-6">
                    <p className="font-medium">Additional Details</p>
                    <p className="text-gray-600 mt-1">{donation.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-green-600"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{new Date(donation.createdAt).toLocaleString()}</p>
                        <p className="font-medium">Donation Created</p>
                        <p className="text-sm text-gray-500">{donation.donorName} created this donation</p>
                      </div>
                    </div>

                    {donation.status !== "pending" && (
                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status Update</p>
                          <p className="font-medium">{getStatusBadge(donation.status).text}</p>
                          <p className="text-sm text-gray-500">
                            {donation.assignedTo ? `Assigned to ${donation.assignedTo}` : "Status updated"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  If you have any questions or concerns about this donation, please contact our support team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
