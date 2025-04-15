"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, MapPin, Calendar, BarChart3, Users, Truck, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getCollectionsByNgo, getDonationById } from "@/lib/storage"
import { OpenMapsButton } from "@/components/open-maps-button"

interface NgoDashboardProps {
  userName: string
}

export function NgoDashboard({ userName }: NgoDashboardProps) {
  const { user } = useAuth()
  const [allCollections, setAllCollections] = useState<any[]>([])
  const [collectionDetails, setCollectionDetails] = useState<Record<string, any>>({})

  useEffect(() => {
    if (user) {
      loadCollections()
    }
  }, [user])

  // Calculate impact metrics
  const calculateImpact = () => {
    // Extract quantities from collections
    let totalKg = 0
    let freshGoodKg = 0
    let stapleKg = 0

    allCollections.forEach((collection) => {
      const details = collectionDetails[collection.id] || {}
      if (details.quantity) {
        // Extract numeric value from quantity string (e.g., "5 kg" -> 5)
        const match = details.quantity.match(/(\d+)/)
        if (match) {
          const kg = Number.parseInt(match[0], 10)
          totalKg += kg

          if (details.condition === "fresh" || details.condition === "good") {
            freshGoodKg += kg
          } else if (details.condition === "staple") {
            stapleKg += kg
          }
        }
      }
    })

    // Calculate metrics
    const peopleFed = Math.round((freshGoodKg * 1000) / 700) // 700g per person per day
    const biogasGenerated = Math.round((stapleKg / 1000) * 0.5 * 10) / 10 // 0.5 tons of biogas per ton of staple food

    return {
      totalKg,
      peopleFed,
      biogasGenerated,
    }
  }

  const { totalKg, peopleFed, biogasGenerated } = calculateImpact()

  const loadCollections = () => {
    if (!user) return

    const collections = getCollectionsByNgo(user.id)

    // Enhance collections with donation details
    const enhancedCollections = collections.map((collection) => {
      const donation = getDonationById(collection.donationId)
      const details = {
        foodName: donation?.foodName || "Food Item",
        foodType: donation?.foodType || "Unknown",
        condition: donation?.condition || "unknown",
        quantity: donation?.quantity || "Unknown quantity",
        date: formatRelativeTime(new Date(collection.createdAt)),
        statusColor: getStatusColor(collection.status),
        address: donation?.address || "Unknown location",
        latitude: donation?.latitude,
        longitude: donation?.longitude,
      }

      // Store details for impact calculation
      setCollectionDetails((prev) => ({
        ...prev,
        [collection.id]: details,
      }))

      return {
        ...collection,
        ...details,
      }
    })

    // Sort by creation date (newest first)
    const sortedCollections = [...enhancedCollections].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    setAllCollections(sortedCollections)
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "text-amber-600"
      case "assigned":
        return "text-blue-600"
      case "in-transit":
        return "text-purple-600"
      case "completed":
        return "text-green-600"
      case "cancelled":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "requested":
        return "Requested"
      case "assigned":
        return "Driver Assigned"
      case "in-transit":
        return "In Transit"
      case "completed":
        return "Collected"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  // Mock data for available donations
  const availableDonations = [
    {
      id: "avail123",
      foodName: "Mixed Vegetables",
      quantity: "8 kg",
      condition: "Fresh",
      donorName: "Supermarket X",
      address: "123 Market St, City",
      distance: "1.5 km",
    },
    {
      id: "avail456",
      foodName: "Pasta and Sauce",
      quantity: "10 packages",
      condition: "Good",
      donorName: "Restaurant Y",
      address: "456 Dining St, City",
      distance: "2.3 km",
    },
  ]

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-8 bg-white border rounded-lg p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Overview
        </TabsTrigger>
        <TabsTrigger value="collections" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          My Collections
        </TabsTrigger>
        <TabsTrigger value="available" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Available Donations
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
                  <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                  Your Impact
                </CardTitle>
                <CardDescription>See the difference you're making</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{totalKg} kg</p>
                      <p className="text-sm text-gray-500">Food Collected</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{peopleFed}</p>
                      <p className="text-sm text-gray-500">People Fed</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{biogasGenerated} tons</p>
                      <p className="text-sm text-gray-500">Biogas Generated</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{allCollections.length}</p>
                      <p className="text-sm text-gray-500">Collections</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Link href="/impact">
                    View Detailed Impact <BarChart3 className="ml-2 h-4 w-4" />
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
            <Card className="h-full border-none shadow-md bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <Users className="h-6 w-6 text-purple-600 mr-2" />
                  People Served
                </CardTitle>
                <CardDescription>Communities you've helped</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-purple-600">250</p>
                      <p className="text-sm text-gray-500">People Fed This Month</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">+15% from last month</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Families</span>
                      <span className="text-sm font-medium">65</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Elderly</span>
                      <span className="text-sm font-medium">45</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Children</span>
                      <span className="text-sm font-medium">140</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Link href="/beneficiaries">View Beneficiary Details</Link>
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
                    <Link href="/collect">
                      Collect Food <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard?tab=collections">
                      Track Collections <MapPin className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard?tab=available">
                      Browse Available Donations <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 w-full text-center">
                  {allCollections.length > 0
                    ? `Your last collection was ${allCollections[0].date}`
                    : "No recent collections"}
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </TabsContent>

      <TabsContent value="collections">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Collections</h2>
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
            >
              <Link href="/collect">
                Collect More Food <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {allCollections.length > 0 ? (
              allCollections.map((collection, index) => (
                <motion.div
                  key={`${collection.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{collection.foodName}</CardTitle>
                          <CardDescription>Collection #{collection.id.slice(-5)}</CardDescription>
                        </div>
                        <Badge className={`${collection.statusColor} bg-green-50`}>
                          {getStatusLabel(collection.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Quantity</p>
                          <p>{collection.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p>{collection.date}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Pickup Address</p>
                          <p>{collection.address}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Driver</p>
                          <p>{collection.driverName || "Not assigned"}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {!collection.driverName && collection.status === "requested" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/assign-driver/${collection.id}`}>
                            <Truck className="mr-2 h-4 w-4" />
                            Assign Driver
                          </Link>
                        </Button>
                      )}
                      {collection.driverName && (
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Contact Driver
                        </Button>
                      )}
                      <OpenMapsButton
                        address={collection.address}
                        latitude={collection.latitude}
                        longitude={collection.longitude}
                        variant="outline"
                        size="sm"
                        className="ml-2"
                      />
                      <Button variant="ghost" size="sm" asChild className="ml-auto">
                        <Link href={`/track/${collection.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-8">
                  <p className="text-muted-foreground">No collections found.</p>
                  <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
                    <Link href="/collect">Collect Food Now</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="available">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Available Donations</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filter by distance:</span>
              <select className="border rounded-md px-2 py-1 text-sm">
                <option>All</option>
                <option>Within 5 km</option>
                <option>Within 10 km</option>
                <option>Within 20 km</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...availableDonations, ...availableDonations, ...availableDonations].map((donation, index) => (
              <motion.div
                key={`${donation.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{donation.foodName}</CardTitle>
                        <CardDescription>From {donation.donorName}</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{donation.condition}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Quantity</p>
                          <p>{donation.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Distance</p>
                          <p className="text-green-600">{donation.distance} away</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Pickup Address</p>
                        <p>{donation.address}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                      asChild
                    >
                      <Link href={`/collect/${donation.id}`}>Claim Donation</Link>
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
            <CardDescription>Manage your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{userName} Food Bank</h3>
                <p className="text-gray-500">Non-Profit Organization</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{user?.email || `contact@${userName.toLowerCase()}foodbank.org`}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>123 Charity Lane, City, State, 12345</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Organization Type</p>
                <p>Food Bank / Soup Kitchen</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">People Served</p>
                <p>250+ weekly</p>
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
