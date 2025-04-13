"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define types
export type UserRole = "donor" | "ngo" | "driver" | "biogas" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: string) => Promise<{ success: boolean; message: string }>
  signup: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isAuthorized: (roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper functions for localStorage
const getItem = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error)
    return null
  }
}

const setItem = <T,>(key: string, value: T): void => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error)
  }
}

const removeItem = (key: string): void => {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error)
  }
}

// Auth-specific functions
const getCurrentUser = (): User | null => getItem<User>("user")
const setCurrentUser = (user: User): void => setItem("user", user)
const removeCurrentUser = (): void => removeItem("user")
const setAuthToken = (token: string): void => setItem("auth-token", token)
const removeAuthToken = (): void => removeItem("auth-token")

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize user state from localStorage
  useEffect(() => {
    // This effect should only run on the client
    if (typeof window === "undefined") return

    try {
      // Check if user is already logged in
      const storedUser = getCurrentUser()
      if (storedUser) {
        setUser(storedUser)
      }
    } catch (error) {
      console.error("Error initializing auth state:", error)
    } finally {
      // Always set loading to false after checking auth state
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string, role: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful login

      // Check if email contains "@" for basic validation
      if (!email.includes("@")) {
        return { success: false, message: "Invalid email format" }
      }

      // Check if password is at least 6 characters
      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters" }
      }

      // Create a mock user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0], // Use part of email as name
        email,
        role: role as UserRole,
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage
      setAuthToken(`mock_token_${Date.now()}`)
      setCurrentUser(newUser)

      // Update state
      setUser(newUser)

      return { success: true, message: "Login successful" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "An error occurred during login" }
    }
  }

  const signup = async (name: string, email: string, password: string, role: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a successful signup

      // Check if email contains "@" for basic validation
      if (!email.includes("@")) {
        return { success: false, message: "Invalid email format" }
      }

      // Check if password is at least 6 characters
      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters" }
      }

      // Create a new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: role as UserRole,
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage
      setAuthToken(`mock_token_${Date.now()}`)
      setCurrentUser(newUser)

      // Update state
      setUser(newUser)

      return { success: true, message: "Signup successful" }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, message: "An error occurred during signup" }
    }
  }

  const logout = () => {
    // Clear localStorage
    removeAuthToken()
    removeCurrentUser()

    // Update state
    setUser(null)

    // Redirect to home page
    router.push("/")
  }

  const isAuthorized = (roles: string[]) => {
    if (!user) return false
    return roles.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
