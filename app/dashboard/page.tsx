"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DonorDashboard } from "@/components/dashboard/donor-dashboard"
import { NgoDashboard } from "@/components/dashboard/ngo-dashboard"
import { DriverDashboard } from "@/components/dashboard/driver-dashboard"
import { BiogasDashboard } from "@/components/dashboard/biogas-dashboard"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    // Only check after auth has finished loading
    if (!isLoading) {
      if (!user) {
        // If not logged in, redirect to login page
        router.push("/login")
      } else {
        // If logged in, show the dashboard
        setPageLoading(false)
      }
    }
  }, [user, router, isLoading])

  // Show loading state while checking authentication
  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Safety check - should never happen due to the redirect above
  if (!user) {
    return null
  }

  const userRole = user.role
  const userName = user.name

  // Determine which dashboard component to render based on user role
  const DashboardComponent = () => {
    switch (userRole) {
      case "donor":
        return <DonorDashboard userName={userName} />
      case "ngo":
        return <NgoDashboard userName={userName} />
      case "driver":
        return <DriverDashboard userName={userName} />
      case "biogas":
        return <BiogasDashboard userName={userName} />
      default:
        return <DonorDashboard userName={userName} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900">Welcome, {userName}!</h1>
            <p className="text-gray-500">
              {userRole === "donor"
                ? "Manage your donations and track your impact"
                : userRole === "ngo"
                  ? "Manage your collections and track your impact"
                  : userRole === "driver"
                    ? "Manage your pickups and deliveries"
                    : "Manage your waste processing and energy production"}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Render the appropriate dashboard based on user role */}
        <DashboardComponent />
      </div>
    </div>
  )
}
