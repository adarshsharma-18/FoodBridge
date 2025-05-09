"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DonationForm } from "@/components/donation-form"
import { useAuth } from "@/contexts/auth-context"

export default function DonatePage() {
  const { user, isAuthorized } = useAuth()
  const router = useRouter()

  // Check if user is authorized to access this page
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/donate")
      return
    }

    if (!isAuthorized(["donor", "admin"])) {
      router.push("/dashboard")
    }
  }, [user, isAuthorized, router])

  if (!user || !isAuthorized(["donor", "admin"])) {
    return null // Don't render anything while redirecting
  }

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
