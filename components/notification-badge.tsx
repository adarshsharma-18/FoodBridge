"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { getDonations, getCollections } from "@/lib/storage"
import { useAuth } from "@/contexts/auth-context"

interface NotificationBadgeProps {
  className?: string
}

export function NotificationBadge({ className }: NotificationBadgeProps) {
  const [count, setCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    // Check for notifications based on user role
    const checkNotifications = () => {
      const donations = getDonations()
      const collections = getCollections()
      let notificationCount = 0

      switch (user.role) {
        case "biogas":
          // Count waste donations awaiting biogas approval
          notificationCount = donations.filter(
            (d) => d.donationType === "waste" && d.status === "awaiting_biogas_approval",
          ).length
          break
        case "driver":
          // Count waste donations approved by biogas plants and regular donations assigned to driver
          notificationCount = donations.filter(
            (d) =>
              (d.donationType === "waste" && d.status === "biogas_approved" && !d.driverId) ||
              (d.status === "assigned" && d.assignedTo === user.id && !d.driverId),
          ).length
          break
        case "donor":
          // Count donations with status updates
          notificationCount = donations.filter(
            (d) =>
              d.donorId === user.id &&
              (d.status === "biogas_approved" || d.status === "driver_accepted" || d.status === "collected"),
          ).length
          break
        case "ngo":
          // Count available donations and collection updates
          notificationCount =
            donations.filter((d) => d.status === "pending").length +
            collections.filter((c) => c.ngoId === user.id && c.status === "in-transit").length
          break
      }

      setCount(notificationCount)
    }

    // Check immediately and then every 30 seconds
    checkNotifications()
    const interval = setInterval(checkNotifications, 30000)

    return () => clearInterval(interval)
  }, [user])

  if (count === 0) return null

  return <Badge className={`bg-red-500 text-white ${className}`}>{count}</Badge>
}
