// Define notification types
export type NotificationType = "food_condition" | "route_change" | "pickup_request" | "delivery_confirmation"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  read: boolean
  metadata?: Record<string, any>
}

// Storage key for notifications
const NOTIFICATIONS_STORAGE_KEY = "foodbridge-notifications"

// Helper functions
export function getNotifications(): Notification[] {
  if (typeof window === "undefined") return []

  try {
    const notifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    return notifications ? JSON.parse(notifications) : []
  } catch (error) {
    console.error("Error getting notifications from storage:", error)
    return []
  }
}

export function storeNotifications(notifications: Notification[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
  } catch (error) {
    console.error("Error storing notifications:", error)
  }
}

// Add a new notification
export function addNotification(notification: Omit<Notification, "id" | "createdAt" | "read">): Notification {
  const notifications = getNotifications()

  const newNotification: Notification = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  }

  storeNotifications([...notifications, newNotification])
  return newNotification
}

// Get notifications for a user
export function getUserNotifications(userId: string): Notification[] {
  const notifications = getNotifications()
  return notifications.filter((notification) => notification.userId === userId)
}

// Mark notification as read
export function markNotificationAsRead(id: string): boolean {
  const notifications = getNotifications()
  const index = notifications.findIndex((notification) => notification.id === id)

  if (index === -1) return false

  notifications[index].read = true
  storeNotifications(notifications)

  return true
}

// Mark all notifications as read for a user
export function markAllNotificationsAsRead(userId: string): void {
  const notifications = getNotifications()
  const updatedNotifications = notifications.map((notification) =>
    notification.userId === userId ? { ...notification, read: true } : notification,
  )

  storeNotifications(updatedNotifications)
}

// Delete a notification
export function deleteNotification(id: string): boolean {
  const notifications = getNotifications()
  const filteredNotifications = notifications.filter((notification) => notification.id !== id)

  if (filteredNotifications.length !== notifications.length) {
    storeNotifications(filteredNotifications)
    return true
  }

  return false
}

/**
 * Send notification to NGO about food condition
 * @param ngoId NGO identifier
 * @param donationId Donation identifier
 * @param condition Food condition
 * @param redirected Whether the food was redirected to biogas
 */
export function notifyNGO(
  ngoId: string,
  donationId: string,
  condition: "edible" | "expired" | "inedible",
  isRedirected: boolean,
): Notification {
  let title: string
  let message: string

  if (isRedirected) {
    title = "Donation Redirected"
    message = `Donation #${donationId.slice(-8)} has been redirected to a biogas plant due to ${condition} condition.`
  } else if (condition === "edible") {
    title = "Food Condition Verified"
    message = `Donation #${donationId.slice(-8)} has been verified as edible and is on its way to you.`
  } else {
    title = "Food Condition Alert"
    message = `Donation #${donationId.slice(-8)} has been found to be in ${condition} condition.`
  }

  return addNotification({
    userId: ngoId,
    type: "food_condition",
    title,
    message,
    metadata: {
      donationId,
      condition,
      isRedirected,
    },
  })
}

/**
 * Send notification to biogas plant about redirected food
 * @param biogasId Biogas plant identifier
 * @param donationId Donation identifier
 * @param condition Food condition
 */
export function notifyBiogasPlant(
  biogasPlantId: string,
  donationId: string,
  condition: "expired" | "inedible",
): Notification {
  return addNotification({
    userId: biogasPlantId,
    type: "pickup_request",
    title: "New Waste Donation",
    message: `A new ${condition} food donation #${donationId.slice(-8)} has been redirected to your facility.`,
    metadata: {
      donationId,
      condition,
    },
  })
}

/**
 * Send notification to driver about route change
 * @param driverId Driver identifier
 * @param donationId Donation identifier
 * @param newDestination New destination type
 */
export function notifyDriver(driverId: string, donationId: string, destination: "ngo" | "biogas"): Notification {
  return addNotification({
    userId: driverId,
    type: "route_change",
    title: "Destination Updated",
    message: `Donation #${donationId.slice(-8)} destination has been updated to ${destination === "ngo" ? "an NGO" : "a biogas plant"}.`,
    metadata: {
      donationId,
      destination,
    },
  })
}
