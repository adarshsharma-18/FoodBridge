"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "@/components/admin/users-table"
import { DonationsTable } from "@/components/admin/donations-table"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Users, Package, TrendingUp, AlertTriangle } from "lucide-react"
import { getDashboardStats } from "@/lib/admin-service"
import { Button } from "@/components/ui/button"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [pageLoading, setPageLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    totalCollections: 0,
    pendingVerifications: 0,
  })

  useEffect(() => {
    // Only check after auth has finished loading
    if (!isLoading) {
      if (!user) {
        // If not logged in, redirect to admin login page
        router.push("/admin/login")
      } else if (user.role !== "admin") {
        // If not admin, redirect to dashboard
        router.push("/dashboard")
      } else {
        // If admin, show the dashboard and load stats
        loadStats()
        setPageLoading(false)
      }
    }
  }, [user, router, isLoading])

  // Add a useEffect hook to refresh stats when verification status changes
  useEffect(() => {
    if (user && user.role === "admin") {
      const interval = setInterval(() => {
        loadStats()
      }, 5000) // Refresh stats every 5 seconds

      return () => clearInterval(interval)
    }
  }, [user])

  // Update the loadStats function to include pending verifications
  const loadStats = () => {
    const stats = getDashboardStats()
    setStats(stats)
  }

  // Show loading state while checking authentication
  if (isLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage users, donations, and system settings</p>
          </div>
          <Button variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Package className="h-5 w-5 text-green-600 mr-2" />
                Total Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalDonations}</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                Total Collections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalCollections}</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
                Pending Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.pendingVerifications}</p>
            </CardContent>
          </Card>
        </div>

        {stats.pendingVerifications > 0 && (
          <div className="mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3" />
              <div>
                <h3 className="font-medium text-amber-800">Pending Verifications</h3>
                <p className="text-amber-700">
                  There {stats.pendingVerifications === 1 ? "is" : "are"} {stats.pendingVerifications} user
                  {stats.pendingVerifications !== 1 ? "s" : ""} waiting for verification. Please review them in the
                  Users tab.
                </p>
              </div>
              <Button
                variant="outline"
                className="ml-auto border-amber-600 text-amber-600 hover:bg-amber-50"
                onClick={() => document.querySelector('[data-state="inactive"][value="users"]')?.click()}
              >
                Review Users
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-8 bg-white border rounded-lg p-1">
            <TabsTrigger value="users" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              Users
            </TabsTrigger>
            <TabsTrigger
              value="donations"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              Donations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTable />
          </TabsContent>

          <TabsContent value="donations">
            <DonationsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
