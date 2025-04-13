import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Package, ArrowRight } from "lucide-react"

export default function TrackPage() {
  const token = cookies().get("auth-token")

  if (!token) {
    redirect("/login?redirect=/track")
  }

  // Mock data for tracking
  const donations = [
    {
      id: "don123",
      foodName: "Cooked Rice",
      foodType: "cooked",
      quantity: "5 kg",
      status: "In Transit",
      statusColor: "text-blue-600",
      address: "123 Main St, City",
      donorName: "Restaurant A",
      createdAt: new Date().toISOString(),
      estimatedDelivery: "Today, 3:00 PM",
      driverName: "John Smith",
      driverPhone: "+1 (555) 123-4567",
    },
    {
      id: "don456",
      foodName: "Fresh Vegetables",
      foodType: "raw",
      quantity: "10 kg",
      status: "Collected",
      statusColor: "text-green-600",
      address: "456 Oak St, City",
      donorName: "Grocery Store B",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      estimatedDelivery: "Delivered",
      driverName: "Maria Garcia",
      driverPhone: "+1 (555) 987-6543",
    },
    {
      id: "don789",
      foodName: "Bread and Pastries",
      foodType: "bakery",
      quantity: "20 items",
      status: "Pending",
      statusColor: "text-amber-600",
      address: "789 Pine St, City",
      donorName: "Bakery C",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      estimatedDelivery: "Awaiting pickup",
      driverName: "Not assigned",
      driverPhone: "N/A",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Track Donations</h1>
          <p className="mt-4 text-gray-500 md:text-xl max-w-[800px]">
            Track the status of your food donations and see where they are in the delivery process.
          </p>
        </div>

        <div className="space-y-6">
          {donations.map((donation) => (
            <Card key={donation.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl">{donation.foodName}</CardTitle>
                    <CardDescription>Donation ID: {donation.id}</CardDescription>
                  </div>
                  <div className={`font-medium text-lg ${donation.statusColor}`}>{donation.status}</div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Donation Details</p>
                        <p className="text-sm text-gray-500">Type: {donation.foodType}</p>
                        <p className="text-sm text-gray-500">Quantity: {donation.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-500">{donation.address}</p>
                        <p className="text-sm text-gray-500">Donor: {donation.donorName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Delivery Status</p>
                        <p className="text-sm text-gray-500">Estimated: {donation.estimatedDelivery}</p>
                        <p className="text-sm text-gray-500">
                          Driver: {donation.driverName} {donation.driverPhone !== "N/A" && `(${donation.driverPhone})`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button asChild variant="ghost" className="ml-auto">
                  <Link href={`/track/${donation.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
