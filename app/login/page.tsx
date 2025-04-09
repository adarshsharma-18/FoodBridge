"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { login, type LoginFormState } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

const initialState: LoginFormState = {}

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(login, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true)
    formAction(formData)
  }

  useEffect(() => {
    if (state.success) {
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } else if (state.errors) {
      setIsSubmitting(false)
    }
  }, [state, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login to FoodBridge</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {state.errors?._form && (
              <Alert variant="destructive">
                <AlertDescription>
                  {state.errors._form.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {state.success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                aria-describedby="email-error"
              />
              {state.errors?.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {state.errors.email.map((error) => (
                    <span key={error}>{error}</span>
                  ))}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required aria-describedby="password-error" />
              {state.errors?.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {state.errors.password.map((error) => (
                    <span key={error}>{error}</span>
                  ))}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

