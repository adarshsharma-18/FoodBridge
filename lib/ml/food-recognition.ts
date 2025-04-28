// Define food classes based on the training data
const FOOD_CLASSES = {
  0: "burger",
  1: "butter_naan",
  2: "chai",
  3: "chapati",
  4: "chole_bhature",
  5: "dal_makhani",
  6: "dhokla",
  7: "fried_rice",
  8: "idli",
  9: "jalebi",
  10: "kaathi_rolls",
  11: "kadai_paneer",
  12: "kulfi",
  13: "masala_dosa",
  14: "momos",
  15: "paani_puri",
  16: "pakode",
  17: "pav_bhaji",
  18: "pizza",
  19: "samosa",
}

// Path to the model
const FOOD_RECOGNITION_MODEL = "/models/FoodResnet.onnx"

// Model loading status
let foodModelLoaded = false
let foodModelLoading = false
let foodModelError: Error | null = null

// Flask server URL
const FLASK_SERVER_URL = "http://localhost:5000"

/**
 * Load the food recognition model
 */
export async function loadFoodRecognitionModel(): Promise<boolean> {
  if (foodModelLoaded) return true
  if (foodModelLoading) {
    // Wait for the current loading process to complete
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!foodModelLoading) {
          clearInterval(checkInterval)
          resolve(foodModelLoaded)
        }
      }, 100)
    })
  }

  try {
    foodModelLoading = true

    // Check if the Flask server is running
    const response = await fetch(`${FLASK_SERVER_URL}/health`)
    if (!response.ok) {
      throw new Error(`Flask server not available: ${response.statusText}`)
    }

    foodModelLoaded = true
    foodModelLoading = false
    return true
  } catch (error) {
    console.error("Error connecting to food recognition server:", error)
    foodModelError = error instanceof Error ? error : new Error(String(error))
    foodModelLoading = false
    return false
  }
}

/**
 * Preprocess an image for the food recognition model
 */
async function preprocessImageForFoodRecognition(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // Resize to 224x224 (model input size)
        canvas.width = 224
        canvas.height = 224

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        // Draw and resize the image
        ctx.drawImage(img, 0, 0, 224, 224)

        // Get base64 representation of the image
        const base64Image = canvas.toDataURL("image/jpeg")
        resolve(base64Image)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = imageUrl
  })
}

/**
 * Analyze a food image and return the predicted food name and confidence
 */
export async function analyzeFoodImage(imageUrl: string): Promise<{ foodName: string; confidence: number }> {
  // Ensure model is loaded
  const modelLoaded = await loadFoodRecognitionModel()
  if (!modelLoaded) {
    throw new Error("Failed to connect to food recognition server")
  }

  try {
    // Preprocess the image to get base64 representation
    const base64Image = await preprocessImageForFoodRecognition(imageUrl)

    // Send the image to the Flask server for prediction
    const response = await fetch(`${FLASK_SERVER_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
      }),
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`)
    }

    // Parse the response
    const result = await response.json()

    return {
      foodName: result.foodName,
      confidence: result.confidence,
    }
  } catch (error) {
    console.error("Error during food recognition:", error)
    throw error
  }
}
