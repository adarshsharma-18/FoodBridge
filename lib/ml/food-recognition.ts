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

    // Simulate model loading time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real implementation, we would load the model here
    // const session = await ort.InferenceSession.create(FOOD_RECOGNITION_MODEL);

    foodModelLoaded = true
    foodModelLoading = false
    return true
  } catch (error) {
    console.error("Error loading food recognition model:", error)
    foodModelError = error instanceof Error ? error : new Error(String(error))
    foodModelLoading = false
    return false
  }
}

/**
 * Preprocess an image for the food recognition model
 */
async function preprocessImageForFoodRecognition(imageUrl: string): Promise<{
  tensor: Float32Array
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        // Create a canvas to resize and normalize the image
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

        // Get image data
        const imageData = ctx.getImageData(0, 0, 224, 224)
        const data = imageData.data

        // Convert to RGB and normalize to [0, 1]
        const tensor = new Float32Array(3 * 224 * 224)
        for (let i = 0; i < 224 * 224; i++) {
          // Convert from RGBA to RGB and normalize
          tensor[i] = data[i * 4] / 255.0 // R
          tensor[i + 224 * 224] = data[i * 4 + 1] / 255.0 // G
          tensor[i + 2 * 224 * 224] = data[i * 4 + 2] / 255.0 // B
        }

        resolve({
          tensor,
          width: 224,
          height: 224,
        })
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
    throw new Error("Failed to load food recognition model")
  }

  try {
    // Preprocess the image
    await preprocessImageForFoodRecognition(imageUrl)

    // In a real implementation, we would run the model inference here
    // const results = await session.run({ input: processedImage.tensor });

    // Simulate model inference with random results
    // In a real implementation, we would parse the model output
    const simulateInference = () => {
      // Simulate food type prediction
      const classIndex = Math.floor(Math.random() * Object.keys(FOOD_CLASSES).length)
      const foodName = FOOD_CLASSES[classIndex as keyof typeof FOOD_CLASSES]
      const confidence = 0.7 + Math.random() * 0.3 // 70-100% confidence

      return {
        foodName,
        confidence,
      }
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return simulateInference()
  } catch (error) {
    console.error("Error during food recognition:", error)
    throw error
  }
}
