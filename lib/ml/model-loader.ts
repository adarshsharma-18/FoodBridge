/**
 * Model loader for the food freshness detection model using ONNX Runtime
 */
// @ts-ignore - Ignore type issues with onnxruntime-web
import * as ort from 'onnxruntime-web';

// Define model paths
export const MODEL_PATHS = {
  FOOD_FRESHNESS: "/models/Fruits_edible.onnx",
}

// Define class names
export const CLASS_NAMES = {
  FOOD: ["apple", "banana", "beetroot", "carrot", "cucumber", "orange", "potato", "tomato", "other"],
  FRESHNESS: ["Fresh", "Spoiled"],
}

// Model loading status
let modelLoaded = false
let modelLoading = false
let modelError: Error | null = null
let session: ort.InferenceSession | null = null

/**
 * Load the ONNX model using ONNX Runtime
 */
export async function loadModel(): Promise<boolean> {
  if (modelLoaded && session) {
    console.log("Model already loaded, reusing existing session");
    return true;
  }
  
  if (modelLoading) {
    console.log("Model is currently loading, waiting for completion");
    // Wait for the current loading process to complete
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!modelLoading) {
          clearInterval(checkInterval)
          resolve(modelLoaded)
        }
      }, 100)
    })
  }

  try {
    modelLoading = true
    console.log("Starting to load model from:", MODEL_PATHS.FOOD_FRESHNESS);
    
    // Configure ONNX Runtime options
    const options: ort.InferenceSession.SessionOptions = {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all'
    };
    
    console.log("Creating ONNX inference session with options:", options);

    try {
      // Create ONNX inference session
      session = await ort.InferenceSession.create(MODEL_PATHS.FOOD_FRESHNESS, options);
      console.log("Model loaded successfully");
      
      // Log model metadata if available
      if (session.inputNames && session.outputNames) {
        console.log("Model input names:", session.inputNames);
        console.log("Model output names:", session.outputNames);
      }
      
      modelLoaded = true;
      modelLoading = false;
      return true;
    } catch (sessionError) {
      console.error("Error creating ONNX session:", sessionError);
      
      // Try with a fallback configuration
      console.log("Trying fallback configuration...");
      try {
        const fallbackOptions: ort.InferenceSession.SessionOptions = {
          executionProviders: ['wasm']
        };
        
        session = await ort.InferenceSession.create(MODEL_PATHS.FOOD_FRESHNESS, fallbackOptions);
        console.log("Model loaded successfully with fallback options");
        
        modelLoaded = true;
        modelLoading = false;
        return true;
      } catch (fallbackError) {
        console.error("Fallback loading also failed:", fallbackError);
        throw fallbackError;
      }
    }
  } catch (error) {
    console.error("Error loading model:", error);
    console.error("Model path:", MODEL_PATHS.FOOD_FRESHNESS);
    
    modelError = error instanceof Error ? error : new Error(String(error));
    modelLoading = false;
    
    // Check if the model file exists by attempting to fetch it
    try {
      const modelResponse = await fetch(MODEL_PATHS.FOOD_FRESHNESS);
      if (!modelResponse.ok) {
        console.error(`Model file not found or inaccessible. Status: ${modelResponse.status}`);
      } else {
        console.log("Model file exists but could not be loaded as an ONNX model");
      }
    } catch (fetchError) {
      console.error("Could not fetch model file:", fetchError);
    }
    
    return false;
  }
}

/**
 * Get the loaded ONNX session
 */
export function getSession(): ort.InferenceSession | null {
  return session;
}

/**
 * Check if the model is loaded
 */
export function isModelLoaded(): boolean {
  return modelLoaded && session !== null;
}

/**
 * Get the model loading error if any
 */
export function getModelError(): Error | null {
  return modelError;
}

/**
 * Reset the model loading state (for testing)
 */
export function resetModelState(): void {
  modelLoaded = false;
  modelLoading = false;
  modelError = null;
  session = null;
  console.log("Model state has been reset");
}
