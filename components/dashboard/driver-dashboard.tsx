"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Calendar, BarChart3, Truck, Navigation, CheckCircle } from "lucide-react"

interface DriverDashboardProps {
  userName: string
}

export function DriverDashboard({ userName }: DriverDashboardProps) {
  // Mock data for pickups
  const assignedPickups = [
    {
      id: "pick123",
      foodName: "Cooked Rice and Curry",
      quantity: "5 kg",
      pickupTime: "Today, 2:00 PM",
      status: "Assigned",
      statusColor: "text-amber-600",
      donorName: "Restaurant A",
      donorAddress: "123 Main St, City",
      recipientName: "Community Food Bank",
      recipientAddress: "456 Charity Ln, City",
      distance: "3.2 km",
    },
    {
      id: "pick456",
      foodName: "Fresh Vegetables",
      quantity: "8 kg",
      pickupTime: "Today, 4:30 PM",
      status: "En Route",
      statusColor: "text-blue-600",
      donorName: "Grocery Store B",
      donorAddress: "789 Market St, City",
      recipientName: "Hope Shelter",
      recipientAddress: "101 Hope St, City",
      distance: "5.7 km",
    },
  ]

  const completedPickups = [
    {
      id: "pick789",
      foodName: "Bread and Pastries",
      quantity: "15 items",
      pickupTime: "Yesterday, 3:15 PM",
      status: "Completed",
      statusColor: "text-green-600",
      donorName: "Bakery C",
      donorAddress: "321 Baker St, City",
      recipientName: "Children's Center",
      recipientAddress: "555 Youth Way, City",
      distance: "4.3 km",
    },
    {
      id: "pick012",
      foodName: "Canned Goods",
      quantity: "20 cans",
      pickupTime: "2 days ago, 1:00 PM",
      status: "Completed",
      statusColor: "text-green-600",
      donorName: "Supermarket D",
      donorAddress: "888 Super St, City",
      recipientName: "Elder Care Facility",
      recipientAddress: "777 Elder Rd, City",
      distance: "6.1 km",
    },
  ]

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-8 bg-white border rounded-lg p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Overview
        </TabsTrigger>
        <TabsTrigger value="assigned" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Assigned Pickups
        </TabsTrigger>
        <TabsTrigger value="completed" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Completed Pickups
        </TabsTrigger>
        <TabsTrigger value="profile" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="h-full border-none shadow-md bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <Truck className="h-6 w-6 text-blue-600 mr-2" />
                  Delivery Stats
                </CardTitle>
                <CardDescription>Your delivery performance</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">32</p>
                      <p className="text-sm text-gray-500">Deliveries This Month</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">245 km</p>
                      <p className="text-sm text-gray-500">Distance Covered</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">98%</p>
                      <p className="text-sm text-gray-500">On-time Rate</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">4.9</p>
                      <p className="text-sm text-gray-500">Rating</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Link href="/stats">
                    View Detailed Stats <BarChart3 className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="h-full border-none shadow-md bg-gradient-to-br from-amber-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <Navigation className="h-6 w-6 text-amber-600 mr-2" />
                  Today's Route
                </CardTitle>
                <CardDescription>Your optimized pickup schedule</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-amber-600">2</p>
                      <p className="text-sm text-gray-500">Pending Pickups</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800">Next: 2:00 PM</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <p className="text-sm">Restaurant A → Community Food Bank</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <p className="text-sm">Grocery Store B → Hope Shelter</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                      <p className="text-xs text-gray-500">Total distance: 8.9 km</p>
                      <p className="text-xs text-gray-500">Estimated completion: 5:30 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <Link href="/route">
                    View Full Route <MapPin className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="h-full border-none shadow-md bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <Calendar className="h-6 w-6 text-green-600 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and activities</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                  >
                    <Link href="/track">
                      Start Next Pickup <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/route">
                      View Route Map <MapPin className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard?tab=assigned">
                      See All Assignments <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 w-full text-center">Your next pickup is in 45 minutes</p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Today's Pickups</h2>
          <div className="space-y-4">
            {assignedPickups.map((pickup, index) => (
              <motion.div
                key={pickup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pickup.foodName}</CardTitle>
                        <CardDescription>Pickup at {pickup.pickupTime}</CardDescription>
                      </div>
                      <Badge className={`${pickup.statusColor} bg-amber-50`}>{pickup.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">From</p>
                        <p>{pickup.donorName}</p>
                        <p className="text-sm text-gray-500">{pickup.donorAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">To</p>
                        <p>{pickup.recipientName}</p>
                        <p className="text-sm text-gray-500">{pickup.recipientAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Details</p>
                        <p>{pickup.quantity}</p>
                        <p className="text-sm text-gray-500">Distance: {pickup.distance}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                      asChild
                    >
                      <Link href={`/track/${pickup.id}`}>
                        {pickup.status === "Assigned" ? "Start Pickup" : "Continue Delivery"}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <Link href={`/pickups/${pickup.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/dashboard?tab=assigned">
                View All Assigned Pickups <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="assigned">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Assigned Pickups</h2>
            <Button asChild variant="outline">
              <Link href="/route">
                View Route Map <MapPin className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {[...assignedPickups, ...assignedPickups].map((pickup, index) => (
              <motion.div
                key={`${pickup.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pickup.foodName}</CardTitle>
                        <CardDescription>Pickup #{pickup.id.slice(-3)}</CardDescription>
                      </div>
                      <Badge className={`${pickup.statusColor} bg-amber-50`}>{pickup.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pickup Time</p>
                        <p>{pickup.pickupTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">From</p>
                        <p>{pickup.donorName}</p>
                        <p className="text-xs text-gray-500">{pickup.donorAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">To</p>
                        <p>{pickup.recipientName}</p>
                        <p className="text-xs text-gray-500">{pickup.recipientAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Details</p>
                        <p>{pickup.quantity}</p>
                        <p className="text-xs text-gray-500">Distance: {pickup.distance}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                      asChild
                    >
                      <Link href={`/track/${pickup.id}`}>
                        {pickup.status === "Assigned" ? "Start Pickup" : "Continue Delivery"}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="ml-2">
                      <Link href={`/route/${pickup.id}`}>Get Directions</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <Link href={`/pickups/${pickup.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="completed">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Completed Pickups</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filter by:</span>
              <select className="border rounded-md px-2 py-1 text-sm">
                <option>All Time</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {[...completedPickups, ...completedPickups].map((pickup, index) => (
              <motion.div
                key={`${pickup.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pickup.foodName}</CardTitle>
                        <CardDescription>Pickup #{pickup.id.slice(-3)}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> {pickup.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pickup Time</p>
                        <p>{pickup.pickupTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">From</p>
                        <p>{pickup.donorName}</p>
                        <p className="text-xs text-gray-500">{pickup.donorAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">To</p>
                        <p>{pickup.recipientName}</p>
                        <p className="text-xs text-gray-500">{pickup.recipientAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Details</p>
                        <p>{pickup.quantity}</p>
                        <p className="text-xs text-gray-500">Distance: {pickup.distance}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/pickups/${pickup.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="profile">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your driver account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{userName}</h3>
                <p className="text-gray-500">Delivery Driver</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{userName.toLowerCase()}@example.com</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>+1 (555) 987-6543</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Vehicle</p>
                <p>Toyota Prius (Hybrid)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">License</p>
                <p>DL-12345678</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Service Area</p>
                <p>Downtown, Westside, Northside</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Edit Profile</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

