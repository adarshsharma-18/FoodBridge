"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, Calendar, BarChart3, Leaf, Zap, CheckCircle } from "lucide-react"

interface BiogasDashboardProps {
  userName: string
}

export function BiogasDashboard({ userName }: BiogasDashboardProps) {
  // Mock data for collections
  const incomingWaste = [
    {
      id: "waste123",
      foodType: "Expired Produce",
      quantity: "50 kg",
      arrivalTime: "Today, 2:00 PM",
      status: "Scheduled",
      statusColor: "text-amber-600",
      donorName: "Supermarket A",
      donorAddress: "123 Market St, City",
    },
    {
      id: "waste456",
      foodType: "Food Processing Waste",
      quantity: "75 kg",
      arrivalTime: "Today, 4:30 PM",
      status: "En Route",
      statusColor: "text-blue-600",
      donorName: "Food Factory B",
      donorAddress: "456 Industry Rd, City",
    },
  ]

  const processedWaste = [
    {
      id: "proc789",
      foodType: "Mixed Food Waste",
      quantity: "120 kg",
      processDate: "Yesterday",
      status: "Processed",
      statusColor: "text-green-600",
      biogasProduced: "18 m³",
      electricityGenerated: "36 kWh",
    },
    {
      id: "proc012",
      foodType: "Restaurant Waste",
      quantity: "85 kg",
      processDate: "2 days ago",
      status: "Processed",
      statusColor: "text-green-600",
      biogasProduced: "12 m³",
      electricityGenerated: "24 kWh",
    },
  ]

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-8 bg-white border rounded-lg p-1">
        <TabsTrigger value="overview" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Overview
        </TabsTrigger>
        <TabsTrigger value="incoming" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Incoming Waste
        </TabsTrigger>
        <TabsTrigger value="processed" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
          Processed Waste
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
                  <Leaf className="h-6 w-6 text-green-600 mr-2" />
                  Biogas Production
                </CardTitle>
                <CardDescription>Current production metrics</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">1,250 kg</p>
                      <p className="text-sm text-gray-500">Waste Processed</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">187 m³</p>
                      <p className="text-sm text-gray-500">Biogas Produced</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">374 kWh</p>
                      <p className="text-sm text-gray-500">Electricity Generated</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">625 kg</p>
                      <p className="text-sm text-gray-500">CO₂ Avoided</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Link href="/production">
                    View Production History <BarChart3 className="ml-2 h-4 w-4" />
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
                  <Zap className="h-6 w-6 text-blue-600 mr-2" />
                  Energy Output
                </CardTitle>
                <CardDescription>Energy generation metrics</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-blue-600">85%</p>
                      <p className="text-sm text-gray-500">Digester Efficiency</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">+5% from last month</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Methane Content</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Digester Temperature</span>
                      <span className="text-sm font-medium">37°C (Optimal)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">pH Level</span>
                      <span className="text-sm font-medium">7.2 (Optimal)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Link href="/metrics">View System Metrics</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="h-full border-none shadow-md bg-gradient-to-br from-amber-50 to-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl flex items-center">
                  <Calendar className="h-6 w-6 text-amber-600 mr-2" />
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
                      Collect Waste <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/track">
                      Track Incoming Waste <MapPin className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/dashboard?tab=incoming">
                      View Scheduled Deliveries <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500 w-full text-center">Next waste delivery in 45 minutes</p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Incoming Waste</h2>
          <div className="space-y-4">
            {incomingWaste.map((waste, index) => (
              <motion.div
                key={waste.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{waste.foodType}</CardTitle>
                        <CardDescription>Arrival at {waste.arrivalTime}</CardDescription>
                      </div>
                      <Badge className={`${waste.statusColor} bg-amber-50`}>{waste.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Quantity</p>
                        <p>{waste.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Source</p>
                        <p>{waste.donorName}</p>
                        <p className="text-sm text-gray-500">{waste.donorAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Estimated Biogas</p>
                        <p>{Number.parseInt(waste.quantity) * 0.15} m³</p>
                        <p className="text-sm text-gray-500">{Number.parseInt(waste.quantity) * 0.3} kWh electricity</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/track/${waste.id}`}>Track Delivery</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <Link href={`/waste/${waste.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/dashboard?tab=incoming">
                View All Incoming Waste <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recently Processed</h2>
          <div className="space-y-4">
            {processedWaste.map((waste, index) => (
              <motion.div
                key={waste.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{waste.foodType}</CardTitle>
                        <CardDescription>Processed on {waste.processDate}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> {waste.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Quantity</p>
                        <p>{waste.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Biogas Produced</p>
                        <p>{waste.biogasProduced}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Electricity Generated</p>
                        <p>{waste.electricityGenerated}</p>
                        <p className="text-sm text-gray-500">
                          ~{Number.parseInt(waste.electricityGenerated) / 10} homes powered for a day
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/waste/${waste.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button asChild variant="outline">
              <Link href="/dashboard?tab=processed">
                View All Processed Waste <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="incoming">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Incoming Waste</h2>
            <Button
              asChild
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
            >
              <Link href="/collect">
                Collect More Waste <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            {[...incomingWaste, ...incomingWaste].map((waste, index) => (
              <motion.div
                key={`${waste.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{waste.foodType}</CardTitle>
                        <CardDescription>Waste ID: #{waste.id.slice(-3)}</CardDescription>
                      </div>
                      <Badge className={`${waste.statusColor} bg-amber-50`}>{waste.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Arrival Time</p>
                        <p>{waste.arrivalTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Quantity</p>
                        <p>{waste.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Source</p>
                        <p>{waste.donorName}</p>
                        <p className="text-xs text-gray-500">{waste.donorAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Potential Output</p>
                        <p>{Number.parseInt(waste.quantity) * 0.15} m³ biogas</p>
                        <p className="text-xs text-gray-500">{Number.parseInt(waste.quantity) * 0.3} kWh electricity</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/track/${waste.id}`}>Track Delivery</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <Link href={`/waste/${waste.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="processed">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Processed Waste</h2>
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
            {[...processedWaste, ...processedWaste].map((waste, index) => (
              <motion.div
                key={`${waste.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{waste.foodType}</CardTitle>
                        <CardDescription>Process ID: #{waste.id.slice(-3)}</CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> {waste.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Process Date</p>
                        <p>{waste.processDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Quantity</p>
                        <p>{waste.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Biogas Produced</p>
                        <p>{waste.biogasProduced}</p>
                        <p className="text-xs text-gray-500">Methane content: 65%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Energy Generated</p>
                        <p>{waste.electricityGenerated}</p>
                        <p className="text-xs text-gray-500">
                          ~{Number.parseInt(waste.electricityGenerated) / 10} homes powered for a day
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/waste/${waste.id}`}>View Details</Link>
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
            <CardDescription>Manage your biogas plant details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold">{userName} Biogas Plant</h3>
                <p className="text-gray-500">Renewable Energy Producer</p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>operations@{userName.toLowerCase()}biogas.com</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>+1 (555) 234-5678</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>456 Energy Way, City, State, 12345</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Capacity</p>
                <p>500 kg/day processing capacity</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Energy Production</p>
                <p>75 kWh/day average</p>
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
