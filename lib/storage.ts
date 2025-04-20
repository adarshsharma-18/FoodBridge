"use client"

// Type definitions
export interface User {
  id: string
  name: string
  email: string
  role: "donor" | "ngo" | "driver" | "biogas" | "admin"
  createdAt: string
}

export interface Donation {
  id: string
  foodName: string
  foodType: string
  quantity: string
  condition: string
  address: string
  donorName: string
  donorId: string
  createdAt: string
  expiryDate?: string
  latitude?: string
  longitude?: string
  // Update status to include new waste-specific statuses
  status:
    | "pending"
    | "assigned"
    | "collected"
    | "delivered"
    | "expired"
    | "awaiting_biogas_approval"
    | "biogas_approved"
    | "awaiting_driver"
    | "driver_accepted"
  assignedTo?: string
  collectedBy?: string
  donationType?: "regular" | "waste"
  wasteCondition?: "edible" | "inedible"
  // Add new fields for waste donation workflow
  biogasPlantId?: string
  biogasPlantName?: string
  driverId?: string
  driverName?: string
  reviewedAt?: string
  acceptedAt?: string
  pickupScheduledFor?: string
}

// Update the Collection interface to include original NGO information
export interface Collection {
  id: string
  donationId: string
  ngoId: string
  ngoName: string
  driverId?: string
  driverName?: string
  pickupTime: string
  notes?: string
  status: "requested" | "assigned" | "in-transit" | "completed" | "cancelled"
  createdAt: string
  completedAt?: string
  // Add fields for tracking redirected donations
  originalNgoId?: string
  originalNgoName?: string
  // Add fields for verification
  verificationPhoto?: string // Changed to store reference ID instead of full data
  verificationResult?: "edible" | "expired" | "inedible"
  verificationImageId?: string
  verificationConfidence?: number
}

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: "foodbridge-auth-token",
  USER: "foodbridge-user",
  DONATIONS: "foodbridge-donations",
  COLLECTIONS: "foodbridge-collections",
}

// Helper functions with quota handling
export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error)
    return defaultValue
  }
}

export function setItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false

  try {
    // Convert to string first to check size
    const serialized = JSON.stringify(value)

    // Check if we're approaching the quota limit (5MB is a safe estimate)
    if (serialized.length > 4 * 1024 * 1024) {
      console.warn(`Warning: Item size for ${key} is large (${Math.round(serialized.length / 1024)}KB)`)

      // If it's collections or donations, try to optimize by removing old items
      if (key === STORAGE_KEYS.COLLECTIONS || key === STORAGE_KEYS.DONATIONS) {
        const items = value as any[]
        if (items.length > 20) {
          // Keep only the 20 most recent items
          const sortedItems = [...items]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 20)

          console.log(`Optimized storage: Reduced ${items.length} items to 20`)
          localStorage.setItem(key, JSON.stringify(sortedItems))
          return true
        }
      }
    }

    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error)

    // If quota exceeded, try to clear some space
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.warn("Storage quota exceeded. Attempting to free up space...")

      // Try to remove old data
      try {
        // For collections, keep only the most recent ones
        if (key === STORAGE_KEYS.COLLECTIONS) {
          const collections = getItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, [])
          if (collections.length > 10) {
            // Keep only the 10 most recent collections
            const recentCollections = [...collections]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 10)

            localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(recentCollections))
            console.log("Cleared old collections to free up space")

            // Try again with the original data
            return setItem(key, value)
          }
        }
      } catch (cleanupError) {
        console.error("Failed to clean up storage:", cleanupError)
      }
    }

    return false
  }
}

export function removeItem(key: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error)
  }
}

// Auth functions
export function getAuthToken(): string | null {
  return getItem<string | null>(STORAGE_KEYS.AUTH_TOKEN, null)
}

export function setAuthToken(token: string): void {
  setItem(STORAGE_KEYS.AUTH_TOKEN, token)
}

export function removeAuthToken(): void {
  removeItem(STORAGE_KEYS.AUTH_TOKEN)
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.USER, null)
}

export function setCurrentUser(user: User): void {
  setItem(STORAGE_KEYS.USER, user)
}

export function removeCurrentUser(): void {
  removeItem(STORAGE_KEYS.USER)
}

// Donation functions
export function getDonations(): Donation[] {
  return getItem<Donation[]>(STORAGE_KEYS.DONATIONS, [])
}

export function setDonations(donations: Donation[]): void {
  setItem(STORAGE_KEYS.DONATIONS, donations)
}

// Update the existing addDonation function to handle the waste donation workflow
export function addDonation(donation: Donation): Donation {
  const donations = getDonations()

  // Ensure all required fields are present
  const validatedDonation = {
    ...donation,
    id: donation.id || `don_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    createdAt: donation.createdAt || new Date().toISOString(),
  }

  // Set the appropriate status for waste donations
  if (validatedDonation.donationType === "waste") {
    validatedDonation.status = "awaiting_biogas_approval"
  } else {
    validatedDonation.status = donation.status || "pending"
  }

  // Add the donation to storage
  const success = setItem(STORAGE_KEYS.DONATIONS, [...donations, validatedDonation])

  // Log for debugging
  if (success) {
    console.log("Donation added to storage:", validatedDonation)
  } else {
    console.error("Failed to add donation to storage due to quota limits")
  }

  return validatedDonation
}

export function updateDonation(updatedDonation: Donation): boolean {
  const donations = getDonations()
  const index = donations.findIndex((d) => d.id === updatedDonation.id)
  if (index !== -1) {
    // Ensure we preserve all fields from the updated donation
    donations[index] = {
      ...donations[index],
      ...updatedDonation,
    }
    return setItem(STORAGE_KEYS.DONATIONS, donations)
  }
  return false
}

export function removeDonation(id: string): void {
  const donations = getDonations()
  setDonations(donations.filter((d) => d.id !== id))
}

// Collection functions
export function getCollections(): Collection[] {
  return getItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, [])
}

export function setCollections(collections: Collection[]): boolean {
  return setItem(STORAGE_KEYS.COLLECTIONS, collections)
}

export function addCollection(collection: Collection): boolean {
  let collections = getCollections()
  collections = [...collections, collection]
  const success = setCollections(collections)

  // Update the related donation status
  if (success) {
    const donations = getDonations()
    const donationIndex = donations.findIndex((d) => d.id === collection.donationId)
    if (donationIndex !== -1) {
      donations[donationIndex].status = "assigned"
      donations[donationIndex].assignedTo = collection.ngoId
      setDonations(donations)
    }
  }

  return success
}

export function updateCollection(updatedCollection: Collection): boolean {
  const collections = getCollections()
  const index = collections.findIndex((c) => c.id === updatedCollection.id)
  if (index !== -1) {
    // Optimize storage by not storing full image data in the collection
    if (updatedCollection.verificationPhoto && updatedCollection.verificationPhoto.length > 1000) {
      // If it's a data URL, just store a reference and keep the actual image in the image storage
      console.log("Optimizing collection storage by removing full image data")
      updatedCollection.verificationPhoto = updatedCollection.verificationImageId || "image_reference"
    }

    collections[index] = updatedCollection
    const success = setCollections(collections)

    // Update the related donation status if needed
    if (success && updatedCollection.status === "completed") {
      const donations = getDonations()
      const donationIndex = donations.findIndex((d) => d.id === updatedCollection.donationId)
      if (donationIndex !== -1) {
        donations[donationIndex].status = "delivered"
        setDonations(donations)
      }
    }

    return success
  }
  return false
}

export function removeCollection(id: string): void {
  const collections = getCollections()
  const collection = collections.find((c) => c.id === id)

  if (collection) {
    // Reset the donation status
    const donations = getDonations()
    const donationIndex = donations.findIndex((d) => d.id === collection.donationId)
    if (donationIndex !== -1) {
      donations[donationIndex].status = "pending"
      donations[donationIndex].assignedTo = undefined
      setDonations(donations)
    }
  }

  setCollections(collections.filter((c) => c.id !== id))
}

// Helper functions for filtering based on user role
export function getDonationsByUser(userId: string): Donation[] {
  const donations = getDonations()
  return donations.filter((d) => d.donorId === userId)
}

export function getCollectionsByNgo(ngoId: string): Collection[] {
  const collections = getCollections()
  return collections.filter((c) => c.ngoId === ngoId)
}

export function getCollectionsByDriver(driverId: string): Collection[] {
  const collections = getCollections()
  return collections.filter((c) => c.driverId === driverId)
}

export function getAvailableDonations(): Donation[] {
  const donations = getDonations()
  return donations.filter((d) => d.status === "pending")
}

export function getAvailableCollections(): Collection[] {
  const collections = getCollections()
  return collections.filter((c) => c.status === "requested" && !c.driverId)
}

export function getAssignedCollections(driverId: string): Collection[] {
  const collections = getCollections()
  return collections.filter((c) => c.driverId === driverId && ["assigned", "in-transit"].includes(c.status))
}

// Initialize with some sample data if empty
export function initializeStorage(): void {
  // Only initialize if storage is empty
  if (getDonations().length === 0) {
    const sampleDonations: Donation[] = [
      {
        id: "don1",
        foodName: "Fresh Cooked Meals",
        foodType: "cooked",
        quantity: "10 kg (approx. 20 servings)",
        condition: "fresh",
        address: "123 Main St, City",
        donorName: "Green Bistro Restaurant",
        donorId: "user1",
        createdAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
        latitude: "40.7128",
        longitude: "-74.0060",
        status: "pending",
      },
      {
        id: "don2",
        foodName: "Bakery Items",
        foodType: "bakery",
        quantity: "5 kg (various items)",
        condition: "good",
        address: "456 Oak St, City",
        donorName: "Daily Bread Bakery",
        donorId: "user2",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        latitude: "40.7138",
        longitude: "-74.0070",
        status: "pending",
      },
      {
        id: "don3",
        foodName: "Fresh Produce",
        foodType: "raw",
        quantity: "8 kg",
        condition: "fresh",
        address: "789 Pine St, City",
        donorName: "FreshMart Supermarket",
        donorId: "user3",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        expiryDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
        latitude: "40.7148",
        longitude: "-74.0080",
        status: "pending",
      },
    ]

    setDonations(sampleDonations)
  }

  if (getCollections().length === 0) {
    // No sample collections initially
    setCollections([])
  }
}

export function getDonationById(id: string): Donation | undefined {
  const donations = getDonations()
  return donations.find((donation) => donation.id === id)
}

export function getRegisteredUsers(): User[] {
  return getItem<User[]>("registered-users", [])
}

// Add a new function to get waste donations for a biogas plant
export function getWasteDonationsForBiogasPlant(biogasPlantId: string): Donation[] {
  const donations = getDonations()
  return donations.filter(
    (d) =>
      d.donationType === "waste" &&
      (d.biogasPlantId === biogasPlantId || (d.status === "awaiting_biogas_approval" && !d.biogasPlantId)),
  )
}

// Add a function to get available waste donations for drivers
export function getAvailableWasteDonationsForDrivers(): Donation[] {
  const donations = getDonations()
  return donations.filter((d) => d.donationType === "waste" && d.status === "biogas_approved" && !d.driverId)
}

// Add a function for biogas plants to approve waste donations
export function approveDonationByBiogasPlant(
  donationId: string,
  biogasPlantId: string,
  biogasPlantName: string,
): Donation | null {
  const donations = getDonations()
  const donationIndex = donations.findIndex((d) => d.id === donationId)

  if (donationIndex === -1) return null

  const donation = donations[donationIndex]

  if (donation.donationType !== "waste" || donation.status !== "awaiting_biogas_approval") {
    return null
  }

  const updatedDonation: Donation = {
    ...donation,
    status: "biogas_approved",
    biogasPlantId,
    biogasPlantName,
    reviewedAt: new Date().toISOString(),
  }

  donations[donationIndex] = updatedDonation
  const success = setDonations(donations)

  return success ? updatedDonation : null
}

// Add a function for drivers to accept waste donations
export function acceptWasteDonationByDriver(donationId: string, driverId: string, driverName: string): Donation | null {
  const donations = getDonations()
  const donationIndex = donations.findIndex((d) => d.id === donationId)

  if (donationIndex === -1) return null

  const donation = donations[donationIndex]

  if (donation.donationType !== "waste" || donation.status !== "biogas_approved") {
    return null
  }

  const updatedDonation: Donation = {
    ...donation,
    status: "driver_accepted",
    driverId,
    driverName,
    acceptedAt: new Date().toISOString(),
  }

  donations[donationIndex] = updatedDonation
  const success = setDonations(donations)

  return success ? updatedDonation : null
}

// Add this function to get available waste pickups
export function getAvailableWastePickups(): Collection[] {
  const donations = getDonations()
  const wasteDonations = donations.filter(
    (d) => d.donationType === "waste" && d.status === "biogas_approved" && !d.assignedTo,
  )

  // Create collection objects for waste donations
  return wasteDonations.map((donation) => ({
    id: `waste_col_${donation.id}`,
    donationId: donation.id,
    ngoId: "biogas_plant", // Placeholder for biogas plant ID
    ngoName: "Biogas Plant Facility",
    pickupTime: new Date().toISOString(),
    status: "requested",
    createdAt: new Date().toISOString(),
    notes: `Waste food pickup (${donation.wasteCondition}) for biogas processing`,
  }))
}
