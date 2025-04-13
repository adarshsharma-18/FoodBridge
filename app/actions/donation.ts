"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

// Define validation schema
const donationSchema = z.object({
  foodName: z.string().min(2, {
    message: "Food name must be at least 2 characters.",
  }),
  foodType: z.string({
    required_error: "Please select a food type.",
  }),
  quantity: z.string().min(1, {
    message: "Please specify the quantity.",
  }),
  condition: z.enum(["fresh", "good", "staple"], {
    required_error: "Please select the food condition.",
  }),
  expiryDate: z.string().optional(),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  description: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

// Type for form state
export type DonationFormState = {
  errors?: {
    foodName?: string[]
    foodType?: string[]
    quantity?: string[]
    condition?: string[]
    expiryDate?: string[]
    address?: string[]
    description?: string[]
    latitude?: string[]
    longitude?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
  donationId?: string
}

// Submit donation action
export async function submitDonation(prevState: DonationFormState, formData: FormData): Promise<DonationFormState> {
  // Check if user is authenticated
  const token = cookies().get("auth-token")
  if (!token?.value) {
    return {
      errors: {
        _form: ["You must be logged in to donate food."],
      },
    }
  }

  // Validate form data
  const validatedFields = donationSchema.safeParse({
    foodName: formData.get("foodName"),
    foodType: formData.get("foodType"),
    quantity: formData.get("quantity"),
    condition: formData.get("condition"),
    expiryDate: formData.get("expiryDate"),
    address: formData.get("address"),
    description: formData.get("description"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors above.",
    }
  }

  try {
    // In a real app, you would save the donation to a database
    // For now, we'll simulate a successful submission

    // Generate a random donation ID
    const donationId = Math.random().toString(36).substring(2, 10)

    // Redirect to success page
    redirect(`/donate/success?id=${donationId}`)

    // This won't be reached due to redirect, but TypeScript expects a return
    return {
      success: true,
      message: "Donation submitted successfully!",
      donationId,
    }
  } catch (error) {
    return {
      errors: {
        _form: ["An error occurred while submitting your donation. Please try again."],
      },
    }
  }
}
