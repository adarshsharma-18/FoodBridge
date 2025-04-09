"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, MapPin, AlertCircle, Store, Utensils, CroissantIcon as Bread, Carrot, Package } from "lucide-react"
import { useActionState } from "react"
import { submitCollection, type CollectionFormState } from "@/app/actions/collection"

interface Donation {
  id: string
  foodName: string
  foodType: string
  quantity: string
  condition: string
  address: string
  donorName: string
  createdAt: string
  distance: string
  latitude: string
  longitude: string
  expiryTime?: string
  preparedAt?: string
  storage?: string
  additionalInfo?: string
  servings?: string
  source?: string
  isRequested?: boolean
}

interface AvailableDonationsProps {
  donations: Donation[]
}

const initialState: CollectionFormState = {}

export function AvailableDonations({ donations }: AvailableDonationsProps) {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [state, formAction] = useActionState(submitCollection, initialState)
  const [claimedDonations, setClaimedDonations] = useState<string[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [activeFilters, setActiveFilters] = useState({
    distance: "all",
    foodType: "all",
    expiryTime: "all",
  })
  const router = useRouter()

  // Initialize with enhanced mock data that matches the image
  useEffect(() => {
    const enhancedDonations = [
      {
        id: "don123",
        foodName: "Fresh Cooked Meals",
        foodType: "cooked",
        quantity: "10 kg (approx. 20 servings)",
        condition: "fresh",
        address: "123 Main St, City",
        donorName: "Green Bistro Restaurant",
        createdAt: new Date().toISOString(),
        distance: "2.3 km",
        latitude: "40.7128",
        longitude: "-74.0060",
        expiryTime: "8 hours",
        preparedAt: "Today at 12:30 PM",
        storage: "Hot/Warm",
        additionalInfo: "Vegetarian Meals",
        isRequested: true,
      },
      {
        id: "don456",
        foodName: "Bakery Items",
        foodType: "bakery",
        quantity: "5 kg (various items)",
        condition: "good",
        address: "456 Oak St, City",
        donorName: "Daily Bread Bakery",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        distance: "4.7 km",
        latitude: "40.7138",
        longitude: "-74.0070",
        expiryTime: "24 hours",
        preparedAt: "Today at 6:00 AM",
        storage: "Room Temperature",
        additionalInfo: "Bread, Pastries",
      },
      {
        id: "don789",
        foodName: "Fresh Produce",
        foodType: "raw",
        quantity: "8 kg",
        condition: "fresh",
        address: "789 Pine St, City",
        donorName: "FreshMart Supermarket",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        distance: "1.8 km",
        latitude: "40.7148",
        longitude: "-74.0080",
        expiryTime: "5 hours",
        storage: "Refrigerated",
        additionalInfo: "Vegetables, Fruits",
        source: "Local Farms",
      },
      {
        id: "don101",
        foodName: "Canned Goods",
        foodType: "packaged",
        quantity: "15 kg (30 cans)",
        condition: "staple",
        address: "101 Market St, City",
        donorName: "Community Pantry",
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        distance: "3.5 km",
        latitude: "40.7158",
        longitude: "-74.0090",
        expiryTime: "6 months",
        storage: "Room Temperature",
        additionalInfo: "Beans, Soups, Vegetables",
      },
      {
        id: "don202",
        foodName: "Dairy Products",
        foodType: "dairy",
        quantity: "4 kg",
        condition: "good",
        address: "202 Dairy Lane, City",
        donorName: "Farm Fresh Market",
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        distance: "5.2 km",
        latitude: "40.7168",
        longitude: "-74.0100",
        expiryTime: "3 days",
        preparedAt: "Today at 8:00 AM",
        storage: "Refrigerated",
        additionalInfo: "Milk, Cheese, Yogurt",
      },
      {
        id: "don303",
        foodName: "Prepared Sandwiches",
        foodType: "cooked",
        quantity: "20 items",
        condition: "fresh",
        address: "303 Cafe St, City",
        donorName: "Urban Cafe",
        createdAt: new Date(Date.now() - 18000000).toISOString(),
        distance: "0.8 km",
        latitude: "40.7178",
        longitude: "-74.0110",
        expiryTime: "10 hours",
        preparedAt: "Today at 10:00 AM",
        storage: "Room Temperature",
        additionalInfo: "Various fillings, includes vegetarian options",
      },
    ]

    setFilteredDonations(enhancedDonations)
  }, [])

  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true)
    formAction(formData)

    // Simulate successful claim
    setTimeout(() => {
      const donationId = formData.get("donationId") as string
      if (donationId) {
        setClaimedDonations((prev) => [...prev, donationId])
      }
      setIsSubmitting(false)
    }, 1500)
  }

  const getFoodIcon = (foodType: string) => {
    switch (foodType.toLowerCase()) {
      case "cooked":
        return <Utensils className="h-10 w-10 text-green-500" />
      case "bakery":
        return <Bread className="h-10 w-10 text-green-500" />
      case "raw":
        return <Carrot className="h-10 w-10 text-green-500" />
      case "packaged":
        return <Package className="h-10 w-10 text-green-500" />
      case "dairy":
        return <Package className="h-10 w-10 text-green-500" />
      default:
        return <Package className="h-10 w-10 text-green-500" />
    }
  }

  const isDonationClaimed = (donationId: string) => {
    return claimedDonations.includes(donationId) || filteredDonations.find((d) => d.id === donationId)?.isRequested
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredDonations.map((donation, index) => (
          <motion.div
            key={donation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex justify-between items-start p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1 text-green-500" />
                  <span>Expires in {donation.expiryTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1 text-green-500" />
                  <span>{donation.distance} away</span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    {getFoodIcon(donation.foodType)}
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900">{donation.foodName}</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Quantity:</span> {donation.quantity}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span> {donation.additionalInfo}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Storage:</span> {donation.storage}
                  </div>
                  {donation.preparedAt && (
                    <div>
                      <span className="font-medium text-gray-700">Prepared:</span> {donation.preparedAt}
                    </div>
                  )}
                  {donation.source && (
                    <div>
                      <span className="font-medium text-gray-700">Sources:</span> {donation.source}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center">
                  <Store className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">{donation.donorName}</span>
                </div>

                {isDonationClaimed(donation.id) ? (
                  <Button className="bg-gray-200 text-gray-700 hover:bg-gray-200 cursor-default" disabled>
                    Requested
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => setSelectedDonation(donation)}
                      >
                        Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Request Food Donation</DialogTitle>
                        <DialogDescription>
                          You are about to request this food donation. Please provide pickup details.
                        </DialogDescription>
                      </DialogHeader>

                      {selectedDonation && (
                        <form action={handleSubmit} className="space-y-4">
                          <input type="hidden" name="donationId" value={selectedDonation.id} />

                          <div className="space-y-2">
                            <Label htmlFor="pickupTime">Estimated Pickup Time</Label>
                            <Input id="pickupTime" name="pickupTime" type="datetime-local" required />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              name="notes"
                              placeholder="Any special instructions for pickup"
                              className="resize-none"
                            />
                          </div>

                          <div className="bg-amber-50 p-3 rounded-md flex items-start">
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 shrink-0" />
                            <p className="text-sm text-amber-800">
                              Once requested, you are responsible for picking up this donation. Please only request if
                              you can collect it.
                            </p>
                          </div>

                          <DialogFooter>
                            <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={isSubmitting}>
                              {isSubmitting ? "Processing..." : "Confirm Request"}
                            </Button>
                          </DialogFooter>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredDonations.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg mt-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No donations available</h3>
          <p className="text-gray-500">
            There are currently no food donations available that match your filters. Please adjust your filters or check
            back later.
          </p>
        </div>
      )}
    </div>
  )
}

