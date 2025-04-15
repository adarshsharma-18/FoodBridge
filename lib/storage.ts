"\"use client"

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
  status: "pending" | "assigned" | "collected" | "delivered" | "expired"
  assignedTo?: string
  collectedBy?: string
}

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
}

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: "foodbridge-auth-token",
  USER: "foodbridge-user",
  DONATIONS: "foodbridge-donations",
  COLLECTIONS: "foodbridge-collections",
}

// Helper functions
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

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error)
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

export function addDonation(donation: Donation): void {
  const donations = getDonations()
  setDonations([...donations, donation])
}

export function updateDonation(updatedDonation: Donation): void {
  const donations = getDonations()
  const index = donations.findIndex((d) => d.id === updatedDonation.id)
  if (index !== -1) {
    donations[index] = updatedDonation
    setDonations(donations)
  }
}

export function removeDonation(id: string): void {
  const donations = getDonations()
  setDonations(donations.filter((d) => d.id !== id))
}

// Collection functions
export function getCollections(): Collection[] {
  return getItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, [])
}

export function setCollections(collections: Collection[]): void {
  setItem(STORAGE_KEYS.COLLECTIONS, collections)
}

export function addCollection(collection: Collection): void {
  let collections = getCollections()
  collections = [...collections, collection]
  setCollections(collections)

  // Update the related donation status
  const donations = getDonations()
  const donationIndex = donations.findIndex((d) => d.id === collection.donationId)
  if (donationIndex !== -1) {
    donations[donationIndex].status = "assigned"
    donations[donationIndex].assignedTo = collection.ngoId
    setDonations(donations)
  }
}

export function updateCollection(updatedCollection: Collection): void {
  const collections = getCollections()
  const index = collections.findIndex((c) => c.id === updatedCollection.id)
  if (index !== -1) {
    collections[index] = updatedCollection
    setCollections(collections)

    // Update the related donation status if needed
    if (updatedCollection.status === "completed") {
      const donations = getDonations()
      const donationIndex = donations.findIndex((d) => d.id === updatedCollection.donationId)
      if (donationIndex !== -1) {
        donations[donationIndex].status = "delivered"
        setDonations(donations)
      }
    }
  }
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
