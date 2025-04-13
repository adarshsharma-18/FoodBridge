"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { MapLocationPicker } from "./map-location-picker"
import { useAuth } from "@/contexts/auth-context"
import { createDonation } from "@/lib/donation-service"

const formSchema = z.object({
  foodName: z.string().min(2, {
    message: "Food name must be at least 2 characters.",
  }),
  foodType: z.string({
    required_error: "Please select a food type.",
  }),
  quantity: z.string().min(1, {
    message: "Please specify the quantity.",
  }),
  condition: z.enum(["fresh", "good", "staple"], {
    required_error: "Please select the food condition.",
  }),
  expiryDate: z.string().optional(),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  description: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

type FormState = {
  errors?: {
    _form?: string[]
  }
  success?: boolean
  message?: string
}

export function DonationForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<FormState>({})
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  })
  const router = useRouter()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodName: "",
      foodType: "",
      quantity: "",
      condition: "fresh",
      expiryDate: "",
      address: location.address,
      description: "",
      latitude: location.latitude,
      longitude: location.longitude,
    },
  })

  const handleLocationSelect = (lat: string, lng: string, address: string) => {
    setLocation({
      latitude: lat,
      longitude: lng,
      address: address,
    })
    form.setValue("address", address)
    form.setValue("latitude", lat)
    form.setValue("longitude", lng)
  }

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      setFormState({
        errors: {
          _form: ["You must be logged in to donate food."],
        },
      })
      return
    }

    setIsSubmitting(true)
    setFormState({})

    try {
      // Create donation in local storage
      const donation = createDonation({
        foodName: data.foodName,
        foodType: data.foodType,
        quantity: data.quantity,
        condition: data.condition,
        address: data.address,
        donorName: user.name,
        donorId: user.id,
        expiryDate: data.expiryDate,
        latitude: data.latitude,
        longitude: data.longitude,
      })

      // Redirect to success page
      router.push(`/donate/success?id=${donation.id}`)
    } catch (error) {
      console.error("Error submitting donation:", error)
      setFormState({
        errors: {
          _form: ["An error occurred while submitting your donation. Please try again."],
        },
      })
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["foodName", "foodType", "quantity", "condition"])
      if (isValid) {
        setStep(2)
      }
    } else if (step === 2) {
      const isValid = await form.trigger(["address"])
      if (isValid) {
        setStep(3)
      }
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Donate Food</CardTitle>
        <CardDescription>
          Fill out this form to donate surplus food. Your donation will help reduce food waste and feed those in need.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <div className={`text-sm font-medium ${step >= 1 ? "text-green-600" : "text-gray-400"}`}>Food Details</div>
            <div className={`text-sm font-medium ${step >= 2 ? "text-green-600" : "text-gray-400"}`}>Location</div>
            <div className={`text-sm font-medium ${step >= 3 ? "text-green-600" : "text-gray-400"}`}>Review</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {formState.errors?._form && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {formState.errors._form.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="foodName">Food Name</Label>
                <Input
                  id="foodName"
                  placeholder="e.g., Cooked Rice, Fresh Vegetables"
                  aria-describedby="foodName-error"
                  {...form.register("foodName")}
                />
                {form.formState.errors.foodName && (
                  <p id="foodName-error" className="text-sm text-red-500">
                    {form.formState.errors.foodName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="foodType">Food Type</Label>
                <Select
                  onValueChange={(value) => form.setValue("foodType", value)}
                  defaultValue={form.getValues("foodType")}
                >
                  <SelectTrigger id="foodType" aria-describedby="foodType-error">
                    <SelectValue placeholder="Select food type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cooked">Cooked Food</SelectItem>
                    <SelectItem value="raw">Raw Vegetables/Fruits</SelectItem>
                    <SelectItem value="packaged">Packaged Food</SelectItem>
                    <SelectItem value="bakery">Bakery Items</SelectItem>
                    <SelectItem value="dairy">Dairy Products</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...form.register("foodType")} />
                {form.formState.errors.foodType && (
                  <p id="foodType-error" className="text-sm text-red-500">
                    {form.formState.errors.foodType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 5 kg, 10 packets, serves 20 people"
                  aria-describedby="quantity-error"
                  {...form.register("quantity")}
                />
                {form.formState.errors.quantity && (
                  <p id="quantity-error" className="text-sm text-red-500">
                    {form.formState.errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Food Condition</Label>
                <RadioGroup
                  defaultValue={form.getValues("condition")}
                  onValueChange={(value) => form.setValue("condition", value as "fresh" | "good" | "staple")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="fresh" id="fresh" />
                    <Label htmlFor="fresh" className="font-normal">
                      Fresh (Newly prepared, best quality)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good" className="font-normal">
                      Good (Still in good condition, safe to consume)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="staple" id="staple" />
                    <Label htmlFor="staple" className="font-normal">
                      Staple (Dry goods, longer shelf life)
                    </Label>
                  </div>
                </RadioGroup>
                <input type="hidden" {...form.register("condition")} />
                {form.formState.errors.condition && (
                  <p className="text-sm text-red-500">{form.formState.errors.condition.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  aria-describedby="expiryDate-error"
                  {...form.register("expiryDate")}
                />
                {form.formState.errors.expiryDate && (
                  <p id="expiryDate-error" className="text-sm text-red-500">
                    {form.formState.errors.expiryDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Any additional information about the food"
                  className="resize-none"
                  aria-describedby="description-error"
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p id="description-error" className="text-sm text-red-500">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="address">Pickup Address</Label>
                <Input
                  id="address"
                  value={location.address}
                  onChange={(e) => {
                    setLocation({ ...location, address: e.target.value })
                    form.setValue("address", e.target.value)
                  }}
                  placeholder="Enter your full address"
                  aria-describedby="address-error"
                />
                <p className="text-sm text-gray-500">This is where the food will be picked up from.</p>
                {form.formState.errors.address && (
                  <p id="address-error" className="text-sm text-red-500">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Pin Location on Map</div>
                <MapLocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialAddress={location.address}
                  initialLat={location.latitude}
                  initialLng={location.longitude}
                />
                <input type="hidden" {...form.register("latitude")} value={location.latitude} />
                <input type="hidden" {...form.register("longitude")} value={location.longitude} />
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Upload Images (Optional)</div>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drag and drop images here, or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">Max 5 images, 5MB each</p>
                  <Button variant="outline" size="sm" className="mt-4" type="button">
                    Browse Files
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium mb-4">Review Your Donation</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Food Name</p>
                      <p>{form.getValues("foodName")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Food Type</p>
                      <p className="capitalize">{form.getValues("foodType")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Quantity</p>
                      <p>{form.getValues("quantity")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Condition</p>
                      <p className="capitalize">{form.getValues("condition")}</p>
                    </div>
                  </div>

                  {form.getValues("expiryDate") && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                      <p>{form.getValues("expiryDate")}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-500">Pickup Address</p>
                    <p>{location.address}</p>
                  </div>

                  {form.getValues("description") && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Additional Details</p>
                      <p>{form.getValues("description")}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-green-800">
                  By submitting this form, you confirm that the food is safe for consumption and the information
                  provided is accurate.
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}

            {step < 3 ? (
              <Button type="button" className="ml-auto" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Donation"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
