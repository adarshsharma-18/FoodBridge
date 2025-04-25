import { loadModel, CLASS_NAMES, getSession } from "./model-loader"
import { preprocessImage } from "./image-preprocessing"

export interface ModelPrediction {
  foodType: string
  foodTypeConfidence: number
  freshness: "Fresh" | "Spoiled"
  freshnessConfidence: number
}

/**
 * Run inference on an image using the food freshness detection model
 * @param imageUrl Data URL of the image
 * @returns Prediction results
 */
export async function runInference(imageUrl: string): Promise<ModelPrediction> {
  // Ensure model is loaded
  const modelLoaded = await loadModel()
  if (!modelLoaded) {
    throw new Error("Failed to load model")
  }

  // Get the ONNX session
  const session = getSession()
  if (!session) {
    throw new Error("Model session not available")
  }

  try {
    // Preprocess the image
    const processedImage = await preprocessImage(imageUrl)
    
    console.log("Image preprocessed successfully, tensor shape:", processedImage.tensor.dims);

    // Run the model inference
    console.log("Running model inference...");
    const feeds = { input: processedImage.tensor };
    
    // Add try-catch specifically for the model run to get detailed error information
    let results;
    try {
      results = await session.run(feeds);
      console.log("Model inference completed successfully");
    } catch (runError) {
      console.error("Error during model.run():", runError);
      console.error("Input tensor details:", {
        dims: processedImage.tensor.dims,
        type: processedImage.tensor.type,
        dataLength: processedImage.tensor.data.length
      });
      throw runError;
    }
    
    // Log available outputs to help debug
    console.log("Model outputs:", Object.keys(results));
    
    // The model outputs two tensors: 'fruit_type' and 'freshness'
    // Check if both outputs are available
    if (!results.fruit_type || !results.freshness) {
      console.error("Expected outputs 'fruit_type' and 'freshness' not found in model results");
      console.error("Available outputs:", Object.keys(results));
      throw new Error("Model did not return expected outputs");
    }
    
    // Process fruit type output
    const fruitTypeOutput = results.fruit_type;
    console.log("Fruit type output shape:", fruitTypeOutput.dims);
    const fruitTypeData = fruitTypeOutput.data as Float32Array;
    console.log("Fruit type data:", Array.from(fruitTypeData).map(v => v.toFixed(4)));
    
    // Process freshness output
    const freshnessOutput = results.freshness;
    console.log("Freshness output shape:", freshnessOutput.dims);
    const freshnessData = freshnessOutput.data as Float32Array;
    console.log("Freshness data:", Array.from(freshnessData).map(v => v.toFixed(4)));
    
    // Apply softmax to get probabilities for fruit type
    const fruitTypeProbs = softmax(Array.from(fruitTypeData));
    console.log("Fruit type probabilities:", fruitTypeProbs.map(v => (v * 100).toFixed(2) + "%"));
    
    // Apply softmax to get probabilities for freshness
    const freshnessProbs = softmax(Array.from(freshnessData));
    console.log("Freshness probabilities:", freshnessProbs.map(v => (v * 100).toFixed(2) + "%"));
    
    // Find the highest probability fruit type
    let maxFoodIndex = 0;
    let maxFoodProb = fruitTypeProbs[0];
    for (let i = 1; i < fruitTypeProbs.length; i++) {
      if (fruitTypeProbs[i] > maxFoodProb) {
        maxFoodProb = fruitTypeProbs[i];
        maxFoodIndex = i;
      }
    }
    
    // Find the highest probability freshness
    const freshIndex = freshnessProbs[0] > freshnessProbs[1] ? 0 : 1;
    const freshConfidence = Math.max(freshnessProbs[0], freshnessProbs[1]);
    
    // Format confidence values to be between 0-1 with two decimal places
    const foodTypeConfidence = parseFloat((Math.min(maxFoodProb, 1.0)).toFixed(2));
    const freshnessConfidence = parseFloat((Math.min(freshConfidence, 1.0)).toFixed(2));
    
    return {
      foodType: CLASS_NAMES.FOOD[maxFoodIndex],
      foodTypeConfidence: foodTypeConfidence,
      freshness: CLASS_NAMES.FRESHNESS[freshIndex] as "Fresh" | "Spoiled",
      freshnessConfidence: freshnessConfidence,
    };
  } catch (error) {
    console.error("Error during model inference:", error)
    throw error
  }
}

/**
 * Softmax function to convert logits to probabilities
 */
function softmax(arr: number[]): number[] {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a: number, b: number) => a + b, 0);
  return exps.map(exp => exp / sum);
}
