// Image storage service for handling all image-related operations

// Type definitions for image records
export interface ImageRecord {
  id: string
  url: string
  thumbnailUrl?: string
  uploadedAt: string
  uploadedBy: string
  type: "donation" | "verification"
  associatedId: string // ID of donation or collection
  metadata?: {
    originalFilename?: string
    fileSize?: number
    width?: number
    height?: number
    mlAssessment?: {
      condition: "Fresh" | "Spoiled"
      confidence: number
      foodType?: string
      foodTypeConfidence?: number
      assessedAt: string
    }
  }
}

// Storage key for images
const IMAGES_STORAGE_KEY = "foodbridge-images"

// Helper functions with quota handling
export function getStoredImages(): ImageRecord[] {
  if (typeof window === "undefined") return []

  try {
    const images = localStorage.getItem(IMAGES_STORAGE_KEY)
    return images ? JSON.parse(images) : []
  } catch (error) {
    console.error("Error getting images from storage:", error)
    return []
  }
}

export function storeImages(images: ImageRecord[]): boolean {
  if (typeof window === "undefined") return false

  try {
    // Optimize storage by compressing thumbnails and limiting the number of stored images
    const optimizedImages =
      images.length > 30
        ? images.slice(-30) // Keep only the 30 most recent images
        : images

    // Convert to string to check size
    const serialized = JSON.stringify(optimizedImages)

    // Check if we're approaching the quota limit
    if (serialized.length > 4 * 1024 * 1024) {
      console.warn(`Warning: Images storage is large (${Math.round(serialized.length / 1024)}KB)`)

      // Keep only the 15 most recent images to save space
      const reducedImages = [...optimizedImages]
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, 15)

      localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(reducedImages))
      console.log(`Optimized image storage: Reduced from ${images.length} to 15 images`)
      return true
    }

    localStorage.setItem(IMAGES_STORAGE_KEY, serialized)
    return true
  } catch (error) {
    console.error("Error storing images:", error)

    // If quota exceeded, try to clear some space
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.warn("Storage quota exceeded for images. Attempting to free up space...")

      try {
        // Keep only the 10 most recent images
        const currentImages = getStoredImages()
        if (currentImages.length > 10) {
          const recentImages = [...currentImages]
            .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
            .slice(0, 10)

          localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(recentImages))
          console.log("Cleared old images to free up space")

          // Try again with the original data if it's not too large
          if (images.length <= 10) {
            return storeImages(images)
          }
        }
      } catch (cleanupError) {
        console.error("Failed to clean up image storage:", cleanupError)
      }
    }

    return false
  }
}

// Add a new image to storage with quota handling
export function addImage(image: Omit<ImageRecord, "id" | "uploadedAt">): ImageRecord {
  const images = getStoredImages()

  // Optimize image data if it's too large
  const optimizedImage = { ...image }

  // If the URL is a data URL and very large, try to use the thumbnail instead
  if (image.url && image.url.startsWith("data:") && image.url.length > 500000 && image.thumbnailUrl) {
    console.log("Using thumbnail instead of full image to save space")
    optimizedImage.url = image.thumbnailUrl
  }

  const newImage: ImageRecord = {
    ...optimizedImage,
    id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    uploadedAt: new Date().toISOString(),
  }

  // Try to store the new image
  const success = storeImages([...images, newImage])

  if (!success) {
    console.warn("Failed to store image due to quota limits. Storing only the most recent images.")
    // Keep only the 5 most recent images plus this new one
    const recentImages = [...images]
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5)

    storeImages([...recentImages, newImage])
  }

  return newImage
}

// Get images by associated ID (donation or collection)
export function getImagesByAssociatedId(id: string): ImageRecord[] {
  const images = getStoredImages()
  return images.filter((image) => image.associatedId === id)
}

// Get images by type
export function getImagesByType(type: "donation" | "verification"): ImageRecord[] {
  const images = getStoredImages()
  return images.filter((image) => image.type === type)
}

// Delete an image
export function deleteImage(id: string): boolean {
  const images = getStoredImages()
  const filteredImages = images.filter((image) => image.id !== id)

  if (filteredImages.length !== images.length) {
    return storeImages(filteredImages)
  }

  return false
}

// Update image metadata
export function updateImageMetadata(id: string, metadata: Partial<ImageRecord["metadata"]>): ImageRecord | null {
  const images = getStoredImages()
  const index = images.findIndex((image) => image.id === id)

  if (index === -1) return null

  const updatedImage = {
    ...images[index],
    metadata: {
      ...images[index].metadata,
      ...metadata,
    },
  }

  images[index] = updatedImage
  const success = storeImages(images)

  return success ? updatedImage : null
}

// Store ML assessment result with an image
export function storeMLAssessment(
  imageId: string,
  condition: "Fresh" | "Spoiled",
  confidence: number,
  foodType?: string,
  foodTypeConfidence?: number,
): ImageRecord | null {
  return updateImageMetadata(imageId, {
    mlAssessment: {
      condition,
      confidence,
      foodType,
      foodTypeConfidence,
      assessedAt: new Date().toISOString(),
    },
  })
}

// Generate a data URL from a File object
export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Generate a thumbnail from a data URL with size optimization
export async function generateThumbnail(dataUrl: string, maxWidth = 200, maxHeight = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // Calculate thumbnail dimensions
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      // Create canvas and draw image
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Use a lower quality for JPEG to save space
      resolve(canvas.toDataURL("image/jpeg", 0.5))
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = dataUrl
  })
}

// Compress an image data URL to reduce storage size
export async function compressImage(dataUrl: string, quality = 0.5): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = dataUrl
  })
}
