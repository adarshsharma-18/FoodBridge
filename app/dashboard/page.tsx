import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions/auth"
import { DonorDashboard } from "@/components/dashboard/donor-dashboard"
import { NgoDashboard } from "@/components/dashboard/ngo-dashboard"
import { DriverDashboard } from "@/components/dashboard/driver-dashboard"
import { BiogasDashboard } from "@/components/dashboard/biogas-dashboard"

export default function DashboardPage() {
  const token = cookies().get("auth-token")
  const role = cookies().get("user-role")
  const email = cookies().get("user-email")

  if (!token) {
    redirect("/login")
  }

  const userRole = role?.value || "donor"
  const userEmail = email?.value || ""
  const userName = userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1)

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
              Manage your {userRole === "donor" ? "donations" : "collections"} and track your impact
            </p>
          </div>
          <form action={logout}>
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </form>
        </div>

        {/* Render the appropriate dashboard based on user role */}
        <DashboardComponent />
      </div>
    </div>
  )
}

