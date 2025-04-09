"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

// Define validation schema
const collectionSchema = z.object({
  donationId: z.string().min(1, {
    message: "Donation ID is required.",
  }),
  pickupTime: z.string().min(1, {
    message: "Please specify a pickup time.",
  }),
  notes: z.string().optional(),
})

// Type for form state
export type CollectionFormState = {
  errors?: {
    donationId?: string[]
    pickupTime?: string[]
    notes?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
  collectionId?: string
}

// Submit collection action
export async function submitCollection(
  prevState: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  // Check if user is authenticated
  const token = cookies().get("auth-token")
  if (!token?.value) {
    return {
      errors: {
        _form: ["You must be logged in to collect food."],
      },
    }
  }

  // Check if user is an NGO
  const role = cookies().get("user-role")
  if (role?.value !== "ngo") {
    return {
      errors: {
        _form: ["Only NGOs can collect food."],
      },
    }
  }

  // Validate form data
  const validatedFields = collectionSchema.safeParse({
    donationId: formData.get("donationId"),
    pickupTime: formData.get("pickupTime"),
    notes: formData.get("notes"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors above.",
    }
  }

  try {
    // In a real app, you would save the collection to a database
    // For now, we'll simulate a successful submission

    // Generate a random collection ID
    const collectionId = Math.random().toString(36).substring(2, 10)

    // Redirect to success page
    redirect(`/collect/success?id=${collectionId}`)

    // This won't be reached due to redirect, but TypeScript expects a return
    return {
      success: true,
      message: "Collection request submitted successfully!",
      collectionId,
    }
  } catch (error) {
    return {
      errors: {
        _form: ["An error occurred while submitting your collection request. Please try again."],
      },
    }
  }
}

// Get available donations
export async function getAvailableDonations() {
  // In a real app, you would fetch this from a database
  // For now, we'll return mock data
  return [
    {
      id: "don123",
      foodName: "Cooked Rice",
      foodType: "cooked",
      quantity: "5 kg",
      condition: "fresh",
      address: "123 Main St, City",
      donorName: "Restaurant A",
      createdAt: new Date().toISOString(),
      distance: "2.3 km",
      latitude: "40.7128",
      longitude: "-74.0060",
    },
    {
      id: "don456",
      foodName: "Fresh Vegetables",
      foodType: "raw",
      quantity: "10 kg",
      condition: "good",
      address: "456 Oak St, City",
      donorName: "Grocery Store B",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      distance: "1.5 km",
      latitude: "40.7138",
      longitude: "-74.0070",
    },
    {
      id: "don789",
      foodName: "Bread and Pastries",
      foodType: "bakery",
      quantity: "20 items",
      condition: "fresh",
      address: "789 Pine St, City",
      donorName: "Bakery C",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      distance: "3.1 km",
      latitude: "40.7148",
      longitude: "-74.0080",
    },
  ]
}

