"use client"

import type React from "react"

import { useState, useRef } from "react"
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
import { ImageIcon, AlertCircle, CheckCircle, Upload, Camera, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { LocationPicker } from "./location-picker"
import { useAuth } from "@/contexts/auth-context"
import { addDonation } from "@/lib/storage"
import { addImage, fileToDataUrl, generateThumbnail } from "@/lib/image-storage"

// Update the form schema to include donationType and wasteCondition
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
  donationType: z.enum(["regular", "waste"]).default("regular"),
  wasteCondition: z.enum(["edible", "inedible"]).optional(),
})

// Create a custom schema that conditionally requires wasteCondition
const conditionalSchema = z.discriminatedUnion("donationType", [
  z.object({
    donationType: z.literal("regular"),
    // All other fields from formSchema
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
    wasteCondition: z.enum(["edible", "inedible"]).optional(),
  }),
  z.object({
    donationType: z.literal("waste"),
    // All other fields from formSchema
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
    // Make wasteCondition required for waste donations
    wasteCondition: z.enum(["edible", "inedible"], {
      required_error: "Please select the waste condition.",
    }),
  }),
])

// Update the FormState type to include the new fields
type FormState = {
  errors?: {
    _form?: string[]
    donationType?: string[]
    wasteCondition?: string[]
  }
  success?: boolean
  message?: string
}

// Interface for uploaded images
interface UploadedImage {
  file: File
  preview: string
  uploading: boolean
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
  const [locationWarning, setLocationWarning] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(conditionalSchema),
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
      donationType: "regular",
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

    // Set a warning if we have an address but no coordinates
    if (address && (!lat || !lng)) {
      setLocationWarning("Address saved without exact coordinates. Drivers may have difficulty finding this location.")
    } else {
      setLocationWarning(null)
    }
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const preview = await fileToDataUrl(file)
        newImages.push({
          file,
          preview,
          uploading: false,
        })
      } catch (error) {
        console.error("Error creating preview for file:", file.name, error)
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages])

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Start camera capture
  const startCamera = async () => {
    setIsCapturing(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setIsCapturing(false)
    }
  }

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL("image/jpeg")

      // Convert data URL to File object
      const byteString = atob(dataUrl.split(",")[1])
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const file = new File([ab], `capture_${Date.now()}.jpg`, { type: mimeString })

      setUploadedImages((prev) => [
        ...prev,
        {
          file,
          preview: dataUrl,
          uploading: false,
        },
      ])

      stopCamera()
    }
  }

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  // Remove an image
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Fix the form submission to work for all donation types
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
      // Generate a unique donation ID with timestamp and random string
      const uniqueId = `don_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`

      // Create the donation object with all details
      const donation = {
        id: uniqueId,
        foodName: data.foodName,
        foodType: data.foodType,
        quantity: data.quantity,
        condition: data.condition,
        address: data.address,
        donorName: user.name,
        donorId: user.id,
        createdAt: new Date().toISOString(),
        expiryDate: data.expiryDate,
        latitude: data.latitude,
        longitude: data.longitude,
        // For waste donations, the status will be set to "awaiting_biogas_approval" in the addDonation function
        status: data.donationType === "waste" ? "awaiting_biogas_approval" : "pending",
        donationType: data.donationType,
        wasteCondition: data.donationType === "waste" ? data.wasteCondition : undefined,
      }

      // Add the donation to storage
      addDonation(donation)

      // Process and store images
      for (const image of uploadedImages) {
        try {
          // Generate thumbnail
          const thumbnailUrl = await generateThumbnail(image.preview)

          // Store image record
          addImage({
            url: image.preview,
            thumbnailUrl,
            uploadedBy: user.id,
            type: "donation",
            associatedId: uniqueId,
            metadata: {
              originalFilename: image.file.name,
              fileSize: image.file.size,
            },
          })
        } catch (error) {
          console.error("Error processing image:", error)
        }
      }

      console.log("Donation submitted successfully:", donation)

      // Redirect based on donation type
      if (data.donationType === "waste") {
        router.push(`/donate/waste-success?id=${uniqueId}`)
      } else {
        router.push(`/donate/success?id=${uniqueId}`)
      }
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
      // Validate first step fields
      const isValid = await form.trigger(["foodName", "foodType", "quantity", "condition", "donationType"])

      // If waste food is selected, also validate wasteCondition
      if (form.getValues("donationType") === "waste") {
        const wasteValid = await form.trigger("wasteCondition")
        if (isValid && wasteValid) {
          setStep(2)
        }
      } else if (isValid) {
        setStep(2)
      }
    } else if (step === 2) {
      // Validate location fields
      const isValid = await form.trigger("address")
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Upload Food Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                  {isCapturing ? (
                    <div className="space-y-4">
                      <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button type="button" onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                          Capture Photo
                        </Button>
                        <Button type="button" variant="outline" onClick={stopCamera}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Upload images of the food you're donating</p>
                      <p className="text-xs text-gray-400 mt-1">Images will help NGOs identify food details</p>
                      <div className="flex mt-4 space-x-4">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="mr-2 h-4 w-4" /> Browse Files
                        </Button>
                        <Button type="button" variant="outline" onClick={startCamera}>
                          <Camera className="mr-2 h-4 w-4" /> Take Photo
                        </Button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Max 5 images, 5MB each. Clear photos help NGOs assess the food quality.
                </p>
              </div>

              {/* Display uploaded images */}
              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Images ({uploadedImages.length})</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt={`Food ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Add the donationType radio group to step 1, after the food condition section */}
              <div className="space-y-2">
                <Label>Donation Type</Label>
                <RadioGroup
                  defaultValue={form.getValues("donationType") || "regular"}
                  onValueChange={(value) => form.setValue("donationType", value as "regular" | "waste")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular" className="font-normal">
                      Regular Donation (For NGOs and people in need)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="waste" id="waste" />
                    <Label htmlFor="waste" className="font-normal">
                      Waste Food (For Biogas Plants)
                    </Label>
                  </div>
                </RadioGroup>
                <input type="hidden" {...form.register("donationType")} />
              </div>

              {/* Conditionally show waste condition if waste food is selected */}
              {form.watch("donationType") === "waste" && (
                <div className="space-y-2">
                  <Label>Waste Condition</Label>
                  <RadioGroup
                    defaultValue={form.getValues("wasteCondition") || "edible"}
                    onValueChange={(value) => form.setValue("wasteCondition", value as "edible" | "inedible")}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="edible" id="edible" />
                      <Label htmlFor="edible" className="font-normal">
                        Edible but expired (Can be processed for biogas)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="inedible" id="inedible" />
                      <Label htmlFor="inedible" className="font-normal">
                        Inedible (Food scraps, spoiled food)
                      </Label>
                    </div>
                  </RadioGroup>
                  <input type="hidden" {...form.register("wasteCondition")} />
                  {form.formState.errors.wasteCondition && (
                    <p className="text-sm text-red-500">{form.formState.errors.wasteCondition.message}</p>
                  )}
                </div>
              )}

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
                <Label htmlFor="address">Pickup Location</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Please provide your location details. This is where the food will be picked up from.
                </p>

                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialAddress={location.address}
                  initialLat={location.latitude}
                  initialLng={location.longitude}
                />

                {locationWarning && (
                  <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{locationWarning}</AlertDescription>
                  </Alert>
                )}

                {location.address && location.latitude && location.longitude && (
                  <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Location details saved successfully. You can proceed to the next step.
                    </AlertDescription>
                  </Alert>
                )}
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

                {/* Display uploaded images in review */}
                {uploadedImages.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-500 mb-2">Uploaded Images</p>
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt={`Food ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Donation Type</p>
                      <p className="capitalize">
                        {form.getValues("donationType") === "waste" ? "Waste Food (For Biogas)" : "Regular Donation"}
                      </p>
                    </div>
                    {form.getValues("donationType") === "waste" && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Waste Condition</p>
                        <p className="capitalize">{form.getValues("wasteCondition")}</p>
                      </div>
                    )}
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
                    {location.latitude && location.longitude ? (
                      <p className="text-xs text-green-600">Exact coordinates available for precise location</p>
                    ) : (
                      <p className="text-xs text-amber-600">
                        No exact coordinates. Drivers will use the address to find the location.
                      </p>
                    )}
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
                  {form.getValues("donationType") === "waste"
                    ? "By submitting this form, you confirm that this waste food will be properly processed for biogas production."
                    : "By submitting this form, you confirm that the food is safe for consumption and the information provided is accurate."}
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
