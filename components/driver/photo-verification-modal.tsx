"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, RefreshCw, CheckCircle, AlertTriangle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { assessFoodCondition } from "@/lib/ml-service"
import { addImage, fileToDataUrl, generateThumbnail, storeMLAssessment } from "@/lib/image-storage"

interface PhotoVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerificationComplete: (
    condition: "edible" | "expired" | "inedible",
    photoUrl: string,
    imageId: string,
    mlConfidence: number,
  ) => void
  donationDetails: {
    foodName: string
    foodType: string
  }
  userId: string
  collectionId: string
}

export function PhotoVerificationModal({
  isOpen,
  onClose,
  onVerificationComplete,
  donationDetails,
  userId,
  collectionId,
}: PhotoVerificationModalProps) {
  const [photo, setPhoto] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [assessmentResult, setAssessmentResult] = useState<"edible" | "expired" | "inedible" | null>(null)
  const [assessmentConfidence, setAssessmentConfidence] = useState<number>(0)
  const [manualSelection, setManualSelection] = useState<"edible" | "expired" | "inedible" | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageId, setImageId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const dataUrl = await fileToDataUrl(file)
      setPhoto(dataUrl)

      // Store image metadata
      const thumbnailUrl = await generateThumbnail(dataUrl)

      // Add image to storage
      const newImage = addImage({
        url: dataUrl,
        thumbnailUrl,
        uploadedBy: userId,
        type: "verification",
        associatedId: collectionId,
        metadata: {
          originalFilename: file.name,
          fileSize: file.size,
        },
      })

      setImageId(newImage.id)
    } catch (error) {
      console.error("Error processing file:", error)
      setError("Failed to process the image. Please try again.")
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
      setError("Could not access camera. Please check permissions or try uploading a photo instead.")
      setIsCapturing(false)
    }
  }

  // Capture photo from camera
  const capturePhoto = async () => {
    if (!videoRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      const photoUrl = canvas.toDataURL("image/jpeg")
      setPhoto(photoUrl)

      // Store image
      try {
        const thumbnailUrl = await generateThumbnail(photoUrl)

        // Create a filename for the captured photo
        const filename = `capture_${Date.now()}.jpg`

        // Add image to storage
        const newImage = addImage({
          url: photoUrl,
          thumbnailUrl,
          uploadedBy: userId,
          type: "verification",
          associatedId: collectionId,
          metadata: {
            originalFilename: filename,
            width: canvas.width,
            height: canvas.height,
          },
        })

        setImageId(newImage.id)
      } catch (error) {
        console.error("Error storing captured image:", error)
        setError("Failed to store the captured image. Please try again.")
      }

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

  // Process the photo with ML model
  const processPhoto = async () => {
    if (!photo || !imageId) return

    setIsProcessing(true)
    setProcessingProgress(0)
    setError(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      // Call the ML service to assess food condition
      const { condition, confidence } = await assessFoodCondition(photo, donationDetails.foodType)
      setAssessmentResult(condition)
      setAssessmentConfidence(confidence)
      setManualSelection(condition) // Set initial manual selection to match ML result

      // Store ML assessment result with the image
      storeMLAssessment(imageId, condition, confidence)
    } catch (err) {
      console.error("Error processing photo:", err)
      setError("Could not analyze the photo. Please select the food condition manually.")
    } finally {
      clearInterval(progressInterval)
      setProcessingProgress(100)
      setIsProcessing(false)
    }
  }

  // Reset the photo and start over
  const resetPhoto = () => {
    setPhoto(null)
    setAssessmentResult(null)
    setManualSelection(null)
    setError(null)
    setProcessingProgress(0)
    setImageId(null)
  }

  // Complete the verification process
  const completeVerification = () => {
    // Use manual selection if available, otherwise use ML assessment
    const finalCondition = manualSelection || assessmentResult
    if (!finalCondition) {
      setError("Please select the food condition before proceeding.")
      return
    }

    if (!photo || !imageId) {
      setError("Please capture or upload a photo before proceeding.")
      return
    }

    onVerificationComplete(finalCondition, photo, imageId, assessmentConfidence)
    resetPhoto()
    onClose()
  }

  // Clean up on close
  const handleClose = () => {
    stopCamera()
    resetPhoto()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Food Condition</DialogTitle>
          <DialogDescription>
            Take or upload a photo of the food to verify its condition before pickup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Photo display area */}
          <div className="border rounded-md overflow-hidden bg-gray-50 aspect-video flex items-center justify-center relative">
            {isCapturing ? (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : photo ? (
              <img src={photo || "/placeholder.svg"} alt="Food" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-6">
                <div className="bg-gray-200 rounded-full p-4 inline-flex mb-2">
                  <Camera className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-gray-500">No photo captured</p>
              </div>
            )}
          </div>

          {/* Camera controls */}
          {!photo && (
            <div className="flex justify-center space-x-4">
              {isCapturing ? (
                <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
                  Capture Photo
                </Button>
              ) : (
                <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                  <Camera className="mr-2 h-4 w-4" /> Open Camera
                </Button>
              )}
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
          )}

          {/* Photo actions */}
          {photo && !isProcessing && !assessmentResult && (
            <div className="flex justify-center space-x-4">
              <Button onClick={processPhoto} className="bg-green-600 hover:bg-green-700">
                Analyze Photo
              </Button>
              <Button variant="outline" onClick={resetPhoto}>
                <RefreshCw className="mr-2 h-4 w-4" /> Retake
              </Button>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Analyzing food condition...</span>
                <span className="text-sm text-gray-500">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          )}

          {/* Assessment result */}
          {assessmentResult && (
            <div className="space-y-4">
              <Alert
                className={
                  assessmentResult === "edible"
                    ? "bg-green-50 border-green-200"
                    : assessmentResult === "expired"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-red-50 border-red-200"
                }
              >
                {assessmentResult === "edible" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                <AlertDescription
                  className={
                    assessmentResult === "edible"
                      ? "text-green-800"
                      : assessmentResult === "expired"
                        ? "text-amber-800"
                        : "text-red-800"
                  }
                >
                  {assessmentResult === "edible"
                    ? "Food appears to be in good condition and edible."
                    : assessmentResult === "expired"
                      ? "Food appears to be expired but suitable for biogas."
                      : "Food appears to be inedible and should be sent to biogas."}
                  <div className="mt-1 text-xs">Confidence: {Math.round(assessmentConfidence * 100)}%</div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Confirm Food Condition:</Label>
                <RadioGroup
                  value={manualSelection || ""}
                  onValueChange={(value) => setManualSelection(value as "edible" | "expired" | "inedible")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="edible" id="edible" />
                    <Label htmlFor="edible" className="font-normal">
                      Edible (Good condition, can be delivered to NGO)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="expired" id="expired" />
                    <Label htmlFor="expired" className="font-normal">
                      Expired (Not suitable for consumption, send to biogas)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="inedible" id="inedible" />
                    <Label htmlFor="inedible" className="font-normal">
                      Inedible (Spoiled/damaged, send to biogas)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={resetPhoto}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake Photo
                </Button>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClose}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button
            onClick={completeVerification}
            disabled={!photo || (!assessmentResult && !manualSelection)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Confirm & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
