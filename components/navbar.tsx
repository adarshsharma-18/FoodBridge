"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, X, User, LogOut, ChevronDown, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const router = useRouter()
  const { user, logout, isAuthorized, isLoading } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Set mock notification count based on role
  useEffect(() => {
    if (user) {
      setNotificationCount(user.role === "ngo" ? 3 : user.role === "driver" ? 2 : 1)
    } else {
      setNotificationCount(0)
    }
  }, [user])

  // Mock notifications based on user role
  const notifications = user
    ? [
        user.role === "donor"
          ? { id: 1, message: "Your donation has been claimed by Community Food Bank", time: "10 minutes ago" }
          : user.role === "ngo"
            ? { id: 1, message: "New food donation available near you", time: "5 minutes ago" }
            : { id: 1, message: "New pickup assigned to you", time: "15 minutes ago" },

        user.role === "ngo"
          ? { id: 2, message: "Reminder: Pickup scheduled for today at 2 PM", time: "1 hour ago" }
          : user.role === "driver"
            ? { id: 2, message: "Delivery confirmed by Food Bank NGO", time: "2 hours ago" }
            : { id: 2, message: "Your previous donation helped feed 15 people", time: "1 day ago" },

        user.role === "ngo" && { id: 3, message: "Monthly impact report is now available", time: "2 days ago" },
      ].filter(Boolean)
    : []

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Render a simplified navbar during loading
  if (isLoading) {
    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className={`text-2xl font-bold ${isScrolled ? "text-green-600" : "text-white"}`}>FoodBridge</span>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className={`text-2xl font-bold ${isScrolled || isMobileMenuOpen ? "text-green-600" : "text-white"}`}>
              FoodBridge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`font-medium hover:text-green-600 transition-colors ${
                isScrolled || isMobileMenuOpen ? "text-gray-700" : "text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/information"
              className={`font-medium hover:text-green-600 transition-colors ${
                isScrolled || isMobileMenuOpen ? "text-gray-700" : "text-white"
              }`}
            >
              Information
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`font-medium hover:text-green-600 transition-colors flex items-center ${
                  isScrolled || isMobileMenuOpen ? "text-gray-700" : "text-white"
                }`}
              >
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* Show donation option only for donors or users with both roles */}
                {(!user || isAuthorized(["donor", "admin"])) && (
                  <DropdownMenuItem>
                    <Link href="/donate" className="w-full">
                      Donate Food
                    </Link>
                  </DropdownMenuItem>
                )}
                {/* Show collection option only for NGOs or users with both roles */}
                {(!user || isAuthorized(["ngo", "admin"])) && (
                  <DropdownMenuItem>
                    <Link href="/collect" className="w-full">
                      Collect Food
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link href="/track" className="w-full">
                    Track Donations
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isScrolled || isMobileMenuOpen ? "outline" : "ghost"}
                      className={`relative ${isScrolled || isMobileMenuOpen ? "text-gray-700" : "text-white"}`}
                      size="icon"
                    >
                      <Bell className="h-5 w-5" />
                      {notificationCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs">
                          {notificationCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                      <h3 className="font-medium">Notifications</h3>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Mark all as read
                      </Button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center">
                      <Button variant="ghost" size="sm" className="text-green-600 text-xs w-full">
                        View all notifications
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isScrolled || isMobileMenuOpen ? "outline" : "ghost"}
                      className={`flex items-center gap-2 ${isScrolled || isMobileMenuOpen ? "border-green-600 text-green-600" : "text-white border-white"}`}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="w-full flex items-center">
                        <User className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant={isScrolled || isMobileMenuOpen ? "outline" : "ghost"}
                  className={
                    isScrolled || isMobileMenuOpen ? "border-green-600 text-green-600" : "text-white border-white"
                  }
                  onClick={() => router.push("/login")}
                >
                  Log In
                </Button>
                <Button
                  className={isScrolled || isMobileMenuOpen ? "bg-green-600 text-white" : "bg-white text-green-600"}
                  onClick={() => router.push("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? (
              <X className={isScrolled || isMobileMenuOpen ? "text-gray-700" : "text-white"} />
            ) : (
              <Menu className={isScrolled || isMobileMenuOpen ? "text-gray-700" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="container px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="font-medium text-gray-700 hover:text-green-600 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/information"
                className="font-medium text-gray-700 hover:text-green-600 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Information
              </Link>
              <details className="group">
                <summary className="font-medium text-gray-700 hover:text-green-600 transition-colors py-2 list-none flex justify-between items-center cursor-pointer">
                  Services
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 transition-transform group-open:rotate-180"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div className="pl-4 mt-2 space-y-2">
                  {/* Show donation option only for donors or users with both roles */}
                  {(!user || isAuthorized(["donor", "admin"])) && (
                    <Link
                      href="/donate"
                      className="block font-medium text-gray-600 hover:text-green-600 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Donate Food
                    </Link>
                  )}
                  {/* Show collection option only for NGOs or users with both roles */}
                  {(!user || isAuthorized(["ngo", "admin"])) && (
                    <Link
                      href="/collect"
                      className="block font-medium text-gray-600 hover:text-green-600 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Collect Food
                    </Link>
                  )}
                  <Link
                    href="/track"
                    className="block font-medium text-gray-600 hover:text-green-600 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Track Donations
                  </Link>
                </div>
              </details>

              {user && (
                <div className="py-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-700">Notifications</h3>
                    <Badge className="bg-red-500">{notificationCount}</Badge>
                  </div>
                  <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-2 bg-gray-50 rounded-md text-sm">
                        <p>{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      router.push("/dashboard")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <User className="mr-2 h-4 w-4" /> Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 w-full"
                    onClick={() => {
                      router.push("/login")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Log In
                  </Button>
                  <Button
                    className="bg-green-600 text-white w-full"
                    onClick={() => {
                      router.push("/signup")
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
