import { getAvailableDonations } from "@/app/actions/collection"
import { AvailableDonations } from "@/components/available-donations"
import DonationFilters from "@/components/donation-filters"

export default async function CollectPage() {
  const donations = await getAvailableDonations()

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
            Available Donations
          </h1>
          <p className="mt-4 text-gray-500 md:text-xl max-w-[800px]">
            Browse available food donations near you and claim them to help reduce food waste.
          </p>
        </div>

        <DonationFilters />

        <AvailableDonations donations={donations} />
      </div>
    </div>
  )
}

