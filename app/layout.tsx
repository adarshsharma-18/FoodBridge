import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { ConditionalChatbot } from "@/components/conditional-chatbot"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FoodBridge - Connecting Surplus Food with Those in Need",
  description:
    "FoodBridge helps reduce food waste by connecting donors with NGOs and converting expired food into biogas energy.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <ConditionalChatbot />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
