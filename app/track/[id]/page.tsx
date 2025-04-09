import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Package, ArrowLeft, Phone, User, Truck } from "lucide-react"

export default function TrackDetailPage({ params }: { params: { id: string } }) {
  const token = cookies().get("auth-token")

  if (!token) {
    redirect("/login?redirect=/track")
  }

  // Mock data for tracking detail
  const donation = {
    id: params.id,
    foodName: "Cooked Rice",
    foodType: "cooked",
    quantity: "5 kg",
    status: "In Transit",
    statusColor: "text-blue-600",
    address: "123 Main St, City",
    donorName: "Restaurant A",
    donorPhone: "+1 (555) 111-2222",
    createdAt: new Date().toISOString(),
    estimatedDelivery: "Today, 3:00 PM",
    driverName: "John Smith",
    driverPhone: "+1 (555) 123-4567",
    recipientName: "Community Food Bank",
    recipientAddress: "789 Charity Lane, City",
    recipientPhone: "+1 (555) 333-4444",
    notes: "Please handle with care. Food is packed in insulated containers.",
    timeline: [
      {
        time: "10:15 AM",
        date: "Today",
        status: "Donation Confirmed",
        description: "Donation has been confirmed and is ready for pickup.",
      },
      {
        time: "11:30 AM",
        date: "Today",
        status: "Driver Assigned",
        description: "John Smith has been assigned to pick up the donation.",
      },
      {
        time: "12:45 PM",
        date: "Today",
        status: "Picked Up",
        description: "Food has been picked up from Restaurant A.",
      },
      {
        time: "1:30 PM",
        date: "Today",
        status: "In Transit",
        description: "Food is on the way to Community Food Bank.",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link href="/track">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Donations
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">{donation.foodName}</CardTitle>
                    <CardDescription>Donation ID: {donation.id}</CardDescription>
                  </div>
                  <div className={`font-medium text-lg ${donation.statusColor}`}>{donation.status}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Donation Details</p>
                        <p className="text-sm text-gray-500">Type: {donation.foodType}</p>
                        <p className="text-sm text-gray-500">Quantity: {donation.quantity}</p>
                        <p className="text-sm text-gray-500 mt-1">{donation.notes}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Delivery Status</p>
                        <p className="text-sm text-gray-500">Estimated: {donation.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Pickup Location</p>
                        <p className="text-sm text-gray-500">{donation.address}</p>
                        <p className="text-sm text-gray-500">
                          Donor: {donation.donorName} ({donation.donorPhone})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Driver Information</p>
                        <p className="text-sm text-gray-500">Name: {donation.driverName}</p>
                        <p className="text-sm text-gray-500">Phone: {donation.driverPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {donation.timeline.map((event, index) => (
                      <div key={index} className="relative pl-10">
                        <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-green-600"></div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            {event.time} • {event.date}
                          </p>
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-gray-500">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-sm text-gray-500">{donation.recipientName}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-500">{donation.recipientAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Contact</p>
                      <p className="text-sm text-gray-500">{donation.recipientPhone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Button className="w-full">Contact Recipient</Button>
              </CardFooter>
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
              <CardFooter className="bg-gray-50 border-t">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

