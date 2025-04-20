import Link from "next/link"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WasteDonationSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const donationId = searchParams.id || "Unknown"

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
      <div className="container px-4 md:px-6 mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Leaf className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Waste Food Donation Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your contribution to sustainable energy. Your waste food donation has been submitted for
            review by a biogas plant.
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-500 mb-1">Donation ID</p>
            <p className="font-medium">{donationId}</p>
          </div>

          <div className="bg-amber-50 p-4 rounded-md mb-6">
            <p className="text-sm text-amber-800">
              <strong>Next Steps:</strong> A biogas plant will review your donation and approve it. Once approved, a
              driver will be assigned to pick up the waste food.
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-6">You can track the status of your donation in your dashboard.</p>

          <div className="flex flex-col space-y-3">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
