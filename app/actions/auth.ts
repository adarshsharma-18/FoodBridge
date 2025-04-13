"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

// Define validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["donor", "ngo", "driver", "biogas"]),
})

// Types for form state
export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}

export type SignupFormState = {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    role?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}

// Login action
export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  // Validate form data
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors above.",
    }
  }

  try {
    // In a real app, you would verify credentials against a database
    // For now, we'll simulate a successful login
    const { email } = validatedFields.data

    // Set a cookie to simulate authentication
    cookies().set("auth-token", "simulated-jwt-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    cookies().set("user-email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // In a real app, you would redirect based on user role
    // For now, redirect to dashboard
    return {
      success: true,
      message: "Login successful! Redirecting...",
    }
  } catch (error) {
    return {
      errors: {
        _form: ["An error occurred during login. Please try again."],
      },
    }
  }
}

// Signup action
export async function signup(prevState: SignupFormState, formData: FormData): Promise<SignupFormState> {
  // Validate form data
  const validatedFields = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  })

  // Return errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please correct the errors above.",
    }
  }

  try {
    // In a real app, you would create a user in the database
    // For now, we'll simulate a successful signup
    const { email, role } = validatedFields.data

    // Set a cookie to simulate authentication
    cookies().set("auth-token", "simulated-jwt-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    cookies().set("user-email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    cookies().set("user-role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // In a real app, you would redirect based on user role
    // For now, redirect to dashboard
    return {
      success: true,
      message: "Signup successful! Redirecting...",
    }
  } catch (error) {
    return {
      errors: {
        _form: ["An error occurred during signup. Please try again."],
      },
    }
  }
}

// Logout action
export async function logout() {
  cookies().delete("auth-token")
  cookies().delete("user-email")
  cookies().delete("user-role")
  redirect("/")
}

// Check if user is authenticated
export async function getAuthStatus() {
  const token = cookies().get("auth-token")
  return !!token?.value
}

// Get user role
export async function getUserRole() {
  const role = cookies().get("user-role")
  return role?.value || null
}
