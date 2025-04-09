"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { signup, type SignupFormState } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialState: SignupFormState = {}

export default function SignupPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(signup, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setIsSubmitting(true)
    formAction(formData)
  }

  useEffect(() => {
    if (state.success) {
      // Redirect to dashboard after successful signup
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
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your information to create a FoodBridge account</CardDescription>
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
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required aria-describedby="name-error" />
              {state.errors?.name && (
                <p id="name-error" className="text-sm text-red-500">
                  {state.errors.name.map((error) => (
                    <span key={error}>{error}</span>
                  ))}
                </p>
              )}
            </div>

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
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required aria-describedby="password-error" />
              {state.errors?.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {state.errors.password.map((error) => (
                    <span key={error}>{error}</span>
                  ))}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select name="role" defaultValue="donor">
                <SelectTrigger id="role" aria-describedby="role-error">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donor">Food Donor</SelectItem>
                  <SelectItem value="ngo">NGO / Food Collector</SelectItem>
                  <SelectItem value="driver">Truck Driver</SelectItem>
                  <SelectItem value="biogas">Biogas Plant</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.role && (
                <p id="role-error" className="text-sm text-red-500">
                  {state.errors.role.map((error) => (
                    <span key={error}>{error}</span>
                  ))}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

