import {
  type Donation,
  type Collection,
  getDonations,
  getCollections,
  addDonation,
  updateDonation,
  addCollection,
  updateCollection,
  getAvailableDonations,
  getDonationsByUser,
  getCollectionsByNgo,
  getCollectionsByDriver,
  getAssignedCollections,
} from "@/lib/storage"

// Donation services
export const createDonation = (donationData: Omit<Donation, "id" | "createdAt" | "status">) => {
  const newDonation: Donation = {
    ...donationData,
    id: `don_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  }

  addDonation(newDonation)
  return newDonation
}

export const getUserDonations = (userId: string) => {
  return getDonationsByUser(userId)
}

export const getAllAvailableDonations = () => {
  return getAvailableDonations()
}

export const getDonationById = (id: string) => {
  const donations = getDonations()
  return donations.find((d) => d.id === id) || null
}

export const updateDonationStatus = (id: string, status: Donation["status"], assignedTo?: string) => {
  const donation = getDonationById(id)
  if (!donation) return null

  const updatedDonation: Donation = {
    ...donation,
    status,
    assignedTo,
  }

  updateDonation(updatedDonation)
  return updatedDonation
}

// Collection services
export const createCollection = (collectionData: Omit<Collection, "id" | "createdAt" | "status">) => {
  const newCollection: Collection = {
    ...collectionData,
    id: `col_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "requested",
  }

  addCollection(newCollection)

  // Update the donation status
  updateDonationStatus(collectionData.donationId, "assigned", collectionData.ngoId)

  return newCollection
}

export const getNgoCollections = (ngoId: string) => {
  return getCollectionsByNgo(ngoId)
}

export const getDriverCollections = (driverId: string) => {
  return getCollectionsByDriver(driverId)
}

export const getCollectionById = (id: string) => {
  const collections = getCollections()
  return collections.find((c) => c.id === id) || null
}

export const assignDriverToCollection = (collectionId: string, driverId: string, driverName: string) => {
  const collection = getCollectionById(collectionId)
  if (!collection) return null

  const updatedCollection: Collection = {
    ...collection,
    driverId,
    driverName,
    status: "assigned",
  }

  updateCollection(updatedCollection)
  return updatedCollection
}

export const updateCollectionStatus = (id: string, status: Collection["status"]) => {
  const collection = getCollectionById(id)
  if (!collection) return null

  const updatedCollection: Collection = {
    ...collection,
    status,
    ...(status === "completed" ? { completedAt: new Date().toISOString() } : {}),
  }

  updateCollection(updatedCollection)

  // If completed, update the donation status
  if (status === "completed") {
    updateDonationStatus(collection.donationId, "delivered")
  }

  return updatedCollection
}

// Dashboard data services
export const getDashboardData = (userId: string, role: string) => {
  const donations = getDonations()
  const collections = getCollections()

  switch (role) {
    case "donor":
      return {
        donations: getDonationsByUser(userId),
        totalDonations: getDonationsByUser(userId).length,
        pendingDonations: getDonationsByUser(userId).filter((d) => d.status === "pending").length,
        deliveredDonations: getDonationsByUser(userId).filter((d) => d.status === "delivered").length,
      }
    case "ngo":
      return {
        collections: getCollectionsByNgo(userId),
        availableDonations: getAvailableDonations(),
        totalCollections: getCollectionsByNgo(userId).length,
        pendingCollections: getCollectionsByNgo(userId).filter((c) => c.status === "requested").length,
        completedCollections: getCollectionsByNgo(userId).filter((c) => c.status === "completed").length,
      }
    case "driver":
      return {
        assignedCollections: getAssignedCollections(userId),
        totalDeliveries: getCollectionsByDriver(userId).length,
        pendingDeliveries: getCollectionsByDriver(userId).filter((c) => c.status === "assigned").length,
        completedDeliveries: getCollectionsByDriver(userId).filter((c) => c.status === "completed").length,
      }
    default:
      return {
        donations,
        collections,
        totalDonations: donations.length,
        totalCollections: collections.length,
      }
  }
}
