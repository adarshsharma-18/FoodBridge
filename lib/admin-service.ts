import { getItem, setItem } from "./storage"

// Get all registered users
export function getRegisteredUsers() {
  const users = getItem("registered-users", [])

  // Add status if not present
  return users.map((user: any) => ({
    ...user,
    status: user.status || (user.role === "admin" ? "verified" : "pending"),
    verified: user.verified || user.status === "verified" || user.role === "admin",
    organization:
      user.organization ||
      (user.role === "ngo" ? `${user.name} NGO` : user.role === "biogas" ? `${user.name} Biogas Plant` : ""),
  }))
}

// Update user status
export function updateUserStatus(userId: string, status: string) {
  const users = getItem("registered-users", [])
  const updatedUsers = users.map((user: any) =>
    user.id === userId ? { ...user, status, verified: status === "verified" } : user,
  )
  setItem("registered-users", updatedUsers)
  return updatedUsers
}

// Remove user
export function removeUser(userId: string) {
  const users = getItem("registered-users", [])
  const updatedUsers = users.filter((user: any) => user.id !== userId)
  setItem("registered-users", updatedUsers)
  return updatedUsers
}

// Get all donations with enhanced details
export function getDonations() {
  const donations = getItem("foodbridge-donations", [])

  // Add additional information if needed
  return donations.map((donation: any) => ({
    ...donation,
    // Add any computed properties here
  }))
}

// Get all collections with enhanced details
export function getCollections() {
  const collections = getItem("foodbridge-collections", [])

  // Add additional information if needed
  return collections.map((collection: any) => {
    // Get related donation
    const donations = getItem("foodbridge-donations", [])
    const relatedDonation = donations.find((d: any) => d.id === collection.donationId) || {}

    return {
      ...collection,
      foodName: relatedDonation.foodName || "Unknown",
      condition: relatedDonation.condition || "unknown",
      donorName: relatedDonation.donorName || "Unknown",
      address: relatedDonation.address || "Unknown location",
    }
  })
}

// Get dashboard statistics
export function getDashboardStats() {
  const users = getRegisteredUsers()
  const donations = getDonations()
  const collections = getCollections()

  return {
    totalUsers: users.length,
    totalDonors: users.filter((u: any) => u.role === "donor").length,
    totalNGOs: users.filter((u: any) => u.role === "ngo").length,
    totalDrivers: users.filter((u: any) => u.role === "driver").length,
    totalBiogasPlants: users.filter((u: any) => u.role === "biogas").length,

    totalDonations: donations.length,
    pendingDonations: donations.filter((d: any) => d.status === "pending").length,
    assignedDonations: donations.filter((d: any) => d.status === "assigned").length,
    deliveredDonations: donations.filter((d: any) => d.status === "delivered").length,

    totalCollections: collections.length,
    completedCollections: collections.filter((c: any) => c.status === "completed").length,

    // Add count of pending verifications
    pendingVerifications: users.filter((u: any) => !u.verified && u.status !== "verified" && u.role !== "admin").length,
  }
}

// Get pending verification users
export function getPendingVerificationUsers() {
  const users = getRegisteredUsers()
  return users.filter((u: any) => !u.verified && u.status !== "verified" && u.role !== "admin")
}
