"use client"

import { useState, useEffect } from "react"
import { Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { analyzeFoodImage } from "@/lib/ml/food-recognition"
import { getFoodDetails } from "@/lib/ml/food-details"

interface FoodAnalysisModalProps {
  imageUrl: string
  isOpen: boolean
  onClose: () => void
  onConfirm: (foodInfo: {
    foodName: string
    foodType?: string
    condition?: "fresh" | "good" | "staple"
  }) => void
}

export function FoodAnalysisModal({ imageUrl, isOpen, onClose, onConfirm }: FoodAnalysisModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "analyzing" | "success" | "error">("idle")
  const [prediction, setPrediction] = useState<{
    foodName: string
    confidence: number
    foodType?: string
    condition?: "fresh" | "good" | "staple"
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isOpen && imageUrl) {
      analyzeImage()
    }
  }, [isOpen, imageUrl])

  const analyzeImage = async () => {
    setStatus("loading")
    setPrediction(null)
    setError(null)
    setProgress(0)

    try {
      // First phase: Image analysis with ML model
      const intervalId = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 45))
      }, 100)

      const result = await analyzeFoodImage(imageUrl)
      clearInterval(intervalId)
      setProgress(50)

      // Second phase: Get additional food details using Mistral AI
      setStatus("analyzing")

      const detailsIntervalId = setInterval(() => {
        setProgress((prev) => Math.min(prev + 3, 95))
      }, 100)

      const foodDetails = await getFoodDetails(result.foodName)
      clearInterval(detailsIntervalId)

      setProgress(100)

      // Combine results
      setPrediction({
        ...result,
        foodType: foodDetails.foodType,
        condition: foodDetails.condition,
      })

      setStatus("success")
    } catch (err) {
      console.error("Food analysis failed:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze food image")
      setStatus("error")
    }
  }

  const handleConfirm = () => {
    if (prediction) {
      onConfirm({
        foodName: prediction.foodName,
        foodType: prediction.foodType,
        condition: prediction.condition,
      })
    }
    onClose()
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.5) return "text-amber-600"
    return "text-red-600"
  }

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Food Analysis</DialogTitle>
          <DialogDescription>Analyzing your food image to identify details.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Image preview */}
          <div className="relative w-full max-w-[300px] aspect-square rounded-md overflow-hidden bg-gray-100">
            {imageUrl && <img src={imageUrl || "/placeholder.svg"} alt="Food" className="w-full h-full object-cover" />}
          </div>

          {/* Status display */}
          {(status === "loading" || status === "analyzing") && (
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm font-medium">
                  {status === "loading" ? "Analyzing food image..." : "Getting food details..."}
                </p>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          )}

          {status === "success" && prediction && (
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <p className="text-lg font-medium">Analysis Complete</p>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-semibold capitalize">{prediction.foodName.replace(/_/g, " ")}</p>
                <p className="text-sm">
                  Confidence:{" "}
                  <span className={getConfidenceColor(prediction.confidence)}>
                    {formatConfidence(prediction.confidence)}
                  </span>
                </p>
              </div>

              {prediction.foodType && (
                <div className="text-sm bg-gray-50 p-2 rounded">
                  <p>
                    <span className="font-medium">Food Type:</span> {prediction.foodType}
                  </p>
                  {prediction.condition && (
                    <p>
                      <span className="font-medium">Suggested Condition:</span> {prediction.condition}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="space-y-2 text-center text-red-600">
              <div className="flex items-center justify-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">Analysis Failed</p>
              </div>
              <p className="text-sm">{error || "Could not analyze the food image. Please try again."}</p>
              <Button variant="outline" size="sm" onClick={analyzeImage} className="mt-2">
                Retry
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2 sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={status !== "success"}
            className={status === "success" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {status === "success" ? "Use This Information" : "OK"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
