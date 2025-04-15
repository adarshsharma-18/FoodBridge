"use client"

import { useAuth } from "@/contexts/auth-context"
import { Chatbot } from "@/components/chatbot"

export function ConditionalChatbot() {
  const { user } = useAuth()

  // Don't render chatbot for admin users
  if (user?.role === "admin") {
    return null
  }

  return <Chatbot />
}
