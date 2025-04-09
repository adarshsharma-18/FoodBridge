"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { User, Building, Truck, Leaf } from "lucide-react"

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState("donors")

  const roleData = {
    donors: {
      title: "For Donors",
      icon: <User className="h-12 w-12 text-green-600 mb-4" />,
      steps: [
        "Register and verify your account",
        "Fill out the donation form with food details",
        "Select food condition (Fresh, Good, Staple)",
        "Pin your location on the map",
        "Submit and receive real-time updates",
      ],
    },
    ngos: {
      title: "For NGOs",
      icon: <Building className="h-12 w-12 text-green-600 mb-4" />,
      steps: [
        "Register with required verification documents",
        "Browse available donations near you",
        "Claim food donations on first-come-first-serve basis",
        "Track pickup in real-time",
        "Receive food and confirm delivery",
      ],
    },
    drivers: {
      title: "For Truck Drivers",
      icon: <Truck className="h-12 w-12 text-green-600 mb-4" />,
      steps: [
        "Register as a verified driver",
        "View assigned pickups with optimized routes",
        "Collect food and verify condition",
        "Deliver to NGOs or biogas plants",
        "Update delivery status in real-time",
      ],
    },
    biogas: {
      title: "For Biogas Plants",
      icon: <Leaf className="h-12 w-12 text-green-600 mb-4" />,
      steps: [
        "Register as a biogas facility",
        "Receive expired/staple food donations",
        "Accept or reject food before processing",
        "Convert food waste into energy",
        "Track and report conversion metrics",
      ],
    },
  }

  return (
    <Tabs defaultValue="donors" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
        <TabsTrigger value="donors">Donors</TabsTrigger>
        <TabsTrigger value="ngos">NGOs</TabsTrigger>
        <TabsTrigger value="drivers">Drivers</TabsTrigger>
        <TabsTrigger value="biogas">Biogas Plants</TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {Object.entries(roleData).map(([key, data]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex flex-col items-center text-center md:w-1/3">
                      {data.icon}
                      <h3 className="text-2xl font-bold mb-2">{data.title}</h3>
                      <p className="text-gray-500">
                        Tailored experience for {data.title.split(" ")[1]} to make the process seamless.
                      </p>
                    </div>
                    <div className="md:w-2/3">
                      <ol className="space-y-4">
                        {data.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex items-center justify-center bg-green-100 text-green-600 rounded-full w-8 h-8 mr-3 shrink-0">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </motion.div>
      </AnimatePresence>
    </Tabs>
  )
}

