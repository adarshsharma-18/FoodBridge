"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Gift, Award, TrendingUp, MapPin, Calendar, BarChart3 } from "lucide-react"
import { getDonationsByUser } from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"

interface DonorDashboardProps {
  userName: string
}

export function DonorDashboard({ userName }: DonorDashboardProps) {
  const { user } = useAuth()
  const [points, setPoints] = useState(350)
  const [level, setLevel] = useState("Silver")
  const nextLevel = "Gold"
  const pointsToNextLevel = 500 - points
  const progress = (points / 500) * 100
  const [userDonations, setUserDonations] = useState<any[]>([])

  // Load user donations
  useEffect(() => {
    if (user) {
      const donations = getDonationsByUser(user.id)
      setUserDonations(donations)
    }
  }, [user])

  // Calculate impact metrics
  const calculateImpact = () => {
    // Extract quantities from donations
    let totalKg = 0
    let freshGoodKg = 0
    let stapleKg = 0

    userDonations.forEach((donation) => {
      // Extract numeric value from quantity string (e.g., "5 kg" -> 5)
      const match = donation.quantity.match(/(\d+)/)
      if (match) {
        const kg = Number.parseInt(match[0], 10)
        totalKg += kg

        if (donation.condition === "fresh" || donation.condition === "good") {
          freshGoodKg += kg
        } else if (donation.condition === "staple") {
          stapleKg += kg
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-600"
      case "assigned":
        return "text-blue-600"
      case "collected":
        return "text-purple-600"
      case "delivered":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  // Mock data for available coupons
  const availableCoupons = [
    {
      id: "coup1",
      title: "20% Off at GreenMart",
      description: "Get 20% off on your next purchase at GreenMart grocery stores",
      pointsCost: 200,
      expiryDate: "Valid until Dec 31, 2023",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "coup2",
      title: "Free Coffee at EcoCafe",
      description: "Enjoy a free coffee at any EcoCafe location",
      pointsCost: 100,
      expiryDate: "Valid until Nov 30, 2023",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "coup3",
      title: "50% Off Sustainable Products",
      description: "Half price on eco-friendly products at EarthGoods",
      pointsCost: 300,
      expiryDate: "Valid until Jan 15, 2024",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Mock data for redeemed coupons
  const redeemedCoupons = [
    {
      id: "redeemed1",
      title: "10% Off at OrganicLife",
      description: "10% discount on organic products",
      redeemedDate: "Oct 15, 2023",
      expiryDate: "Dec 15, 2023",
      code: "ORGANIC10",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  const handleRedeemCoupon = (couponId: string, pointsCost: number) => {
    if (points >= pointsCost) {
      setPoints(points - pointsCost)
      // In a real app, you would update the redeemed coupons list
      alert(`Coupon redeemed successfully! You now have ${points - pointsCost} points.`)
    } else {
      alert(`Not enough points. You need ${pointsCost - points} more points.`)
    }
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-8 bg-white border rounded-lg p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Overview
        </TabsTrigger>
        <TabsTrigger value="donations" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          My Donations
        </TabsTrigger>
        <TabsTrigger value="rewards" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Rewards & Coupons
        </TabsTrigger>
        <TabsTrigger value="profile" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="h-full border-none shadow-md bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <Award className="h-6 w-6 text-green-600 mr-2" />
                  Reward Points
                </CardTitle>
                <CardDescription>Earn points with every donation</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-green-600">{points}</p>
                      <p className="text-sm text-gray-500">Current Points</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-amber-400 to-amber-300 text-amber-900 px-3 py-1">
                      {level} Level
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {nextLevel}</span>
                      <span>{points}/500 points</span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                    <p className="text-xs text-gray-500">
                      Earn {pointsToNextLevel} more points to reach {nextLevel} level
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Link href="/dashboard?tab=rewards">
                    View Rewards <Gift className="ml-2 h-4 w-4" />
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
                      <p className="text-sm text-gray-500">Food Donated</p>
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
                      <p className="text-2xl font-bold text-blue-600">{userDonations.length}</p>
                      <p className="text-sm text-gray-500">Donations</p>
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
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="h-full border-none shadow-md bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <Calendar className="h-6 w-6 text-purple-600 mr-2" />
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
                    <Link href="/donate">
                      Donate Food <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard?tab=donations">
                      Track Donations <MapPin className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard?tab=rewards">
                      Redeem Points <Gift className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 w-full text-center">
                  {userDonations.length > 0
                    ? `Your last donation was ${formatDate(userDonations[0].createdAt)}`
                    : "No donations yet. Start donating today!"}
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </TabsContent>

      <TabsContent value="donations">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Donations</h2>
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
            >
              <Link href="/donate">
                New Donation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {userDonations.length > 0 ? (
              userDonations.map((donation, index) => (
                <motion.div
                  key={`${donation.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{donation.foodName}</CardTitle>
                          <CardDescription>Donation #{donation.id.slice(-3)}</CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(donation.status)} bg-green-50`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Quantity</p>
                          <p>{donation.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date</p>
                          <p>{formatDate(donation.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Points Earned</p>
                          <p className="text-green-600">+{Math.floor(Number.parseInt(donation.quantity) * 5)} points</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Collected By</p>
                          <p>{donation.collectedBy || (donation.assignedTo ? "Assigned" : "Pending")}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/track/${donation.id}`}>Track Donation</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="ml-auto">
                        <Link href={`/donations/${donation.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-3 mb-4">
                    <Gift className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Donations Yet</h3>
                  <p className="text-gray-500 text-center mb-6 max-w-md">
                    You haven't made any donations yet. Start donating surplus food to make a difference in your
                    community.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                  >
                    <Link href="/donate">Make Your First Donation</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="rewards">
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <Award className="h-6 w-6 mr-2" />
                  Your Rewards
                </h2>
                <p>Earn points with every donation and redeem them for exclusive rewards</p>
              </div>
              <div className="text-center">
                <p className="text-sm">Current Points</p>
                <p className="text-4xl font-bold">{points}</p>
                <Badge className="bg-white text-green-700 mt-2">{level} Level</Badge>
              </div>
            </div>
            <div className="mt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextLevel}</span>
                  <span>{points}/500 points</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/30" indicatorClassName="bg-white" />
                <p className="text-sm">
                  Earn {pointsToNextLevel} more points to reach {nextLevel} level and unlock premium rewards
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="available" className="w-full">
            <TabsList className="mb-6 bg-white border rounded-lg p-1 w-full md:w-auto">
              <TabsTrigger
                value="available"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
              >
                Available Coupons
              </TabsTrigger>
              <TabsTrigger
                value="redeemed"
                className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
              >
                Redeemed Coupons
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableCoupons.map((coupon, index) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Card className="border-none shadow-md hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            <Image
                              src={coupon.logo || "/placeholder.svg"}
                              alt={coupon.title}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <Badge className="bg-green-100 text-green-800">{coupon.pointsCost} points</Badge>
                        </div>
                        <CardTitle className="text-xl mt-2">{coupon.title}</CardTitle>
                        <CardDescription>{coupon.expiryDate}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-gray-600">{coupon.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className={`w-full ${
                            points >= coupon.pointsCost
                              ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                          disabled={points < coupon.pointsCost}
                          onClick={() => handleRedeemCoupon(coupon.id, coupon.pointsCost)}
                        >
                          {points >= coupon.pointsCost
                            ? "Redeem Coupon"
                            : `Need ${coupon.pointsCost - points} more points`}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="redeemed">
              {redeemedCoupons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {redeemedCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Card className="border-none shadow-md bg-gradient-to-br from-gray-50 to-white">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                              <Image
                                src={coupon.logo || "/placeholder.svg"}
                                alt={coupon.title}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Redeemed</Badge>
                          </div>
                          <CardTitle className="text-xl mt-2">{coupon.title}</CardTitle>
                          <CardDescription>Redeemed on {coupon.redeemedDate}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-gray-600 mb-4">{coupon.description}</p>
                          <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                            <p className="text-sm text-gray-500 mb-1">Coupon Code</p>
                            <div className="flex items-center justify-between">
                              <p className="font-mono font-bold text-lg">{coupon.code}</p>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Copy code</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <p className="text-sm text-gray-500">Expires on {coupon.expiryDate}</p>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Redeemed Coupons</h3>
                  <p className="text-gray-500 mb-6">
                    You haven't redeemed any coupons yet. Use your points to get exclusive rewards!
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/dashboard?tab=rewards&subtab=available">Browse Available Coupons</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </TabsContent>

      <TabsContent value="profile">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{userName}</h3>
                <p className="text-gray-500 capitalize">{level} Level Donor</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{user?.email || "john.doe@example.com"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="capitalize">Donor</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p>{user ? new Date(user.createdAt).toLocaleDateString() : "January 15, 2023"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                <p>{userDonations.length} donations</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Points Earned</p>
                <p>{points} points</p>
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
