import { DonationForm } from "@/components/donation-form"

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Donate Food</h1>
          <p className="mt-4 text-gray-500 md:text-xl max-w-[800px]">
            Your donation can make a difference. Fill out the form below to donate surplus food and help reduce food
            waste.
          </p>
        </div>

        <DonationForm />
      </div>
    </div>
  )
}

