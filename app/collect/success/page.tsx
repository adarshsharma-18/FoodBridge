import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CollectionSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const collectionId = searchParams.id || "Unknown"

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
      <div className="container px-4 md:px-6 mx-auto max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Collection Request Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for claiming this donation. Your contribution helps reduce food waste and supports those in need.
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-500 mb-1">Collection ID</p>
            <p className="font-medium">{collectionId}</p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            You will receive a confirmation email shortly with details about your collection. You can also track the
            status in your dashboard.
          </p>

          <div className="flex flex-col space-y-3">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/collect">Browse More Donations</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

