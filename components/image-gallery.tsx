"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { ImageRecord } from "@/lib/image-storage"

interface ImageGalleryProps {
  images: ImageRecord[]
  associatedId: string
}

export function ImageGallery({ images, associatedId }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md">
        <p className="text-gray-500">No images available</p>
      </div>
    )
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    resetTransforms()
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    resetTransforms()
  }

  const openModal = (index: number) => {
    setCurrentIndex(index)
    setIsModalOpen(true)
    resetTransforms()
  }

  const resetTransforms = () => {
    setZoomLevel(1)
    setRotation(0)
  }

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const currentImage = images[currentIndex]
  const hasMLAssessment = currentImage?.metadata?.mlAssessment

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer border-2 ${
              index === currentIndex ? "border-green-500" : "border-transparent"
            }`}
            onClick={() => openModal(index)}
          >
            <img
              src={image.thumbnailUrl || image.url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
        <img
          src={currentImage.url || "/placeholder.svg"}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 bg-black/30 text-white hover:bg-black/50 rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {hasMLAssessment && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            ML Assessment: {currentImage.metadata?.mlAssessment?.condition}(
            {Math.round(currentImage.metadata?.mlAssessment?.confidence * 100)}% confidence)
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative h-[80vh] bg-black flex items-center justify-center">
            <img
              src={currentImage.url || "/placeholder.svg"}
              alt={`Image ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain transition-transform"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              }}
            />

            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white hover:bg-black/50 rounded-full"
                onClick={zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white hover:bg-black/50 rounded-full"
                onClick={zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white hover:bg-black/50 rounded-full"
                onClick={rotate}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/30 text-white hover:bg-black/50 rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {hasMLAssessment && (
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-md">
                <p className="font-medium">ML Assessment</p>
                <p>Condition: {currentImage.metadata?.mlAssessment?.condition}</p>
                <p>Confidence: {Math.round(currentImage.metadata?.mlAssessment?.confidence * 100)}%</p>
                <p className="text-xs mt-1">
                  Assessed at: {new Date(currentImage.metadata?.mlAssessment?.assessedAt || "").toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
