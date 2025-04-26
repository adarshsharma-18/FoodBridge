// Define the notification type
export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  createdAt: Date
  metadata?: Record<string, any>
}

// In-memory storage for notifications
const notifications: Notification[] = []

/**
 * Add a new notification
 * @param notification Notification data
 * @returns The created notification
 */
export function addNotification(notification: Omit<Notification, "id" | "read" | "createdAt">): Notification {
  const newNotification: Notification = {
    id: generateId(),
    read: false,
    createdAt: new Date(),
    ...notification,
  }

  notifications.push(newNotification)
  return newNotification
}

/**
 * Get notifications for a user
 * @param userId User identifier
 * @returns List of notifications for the user
 */
export function getUserNotifications(userId: string): Notification[] {
  return notifications.filter((n) => n.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

/**
 * Mark a notification as read
 * @param notificationId Notification identifier
 */
export function markNotificationAsRead(notificationId: string): void {
  const notification = notifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

/**
 * Mark all notifications for a user as read
 * @param userId User identifier
 */
export function markAllNotificationsAsRead(userId: string): void {
  notifications.filter((n) => n.userId === userId).forEach((n) => (n.read = true))
}

/**
 * Generate a random ID
 * @returns Random ID string
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
