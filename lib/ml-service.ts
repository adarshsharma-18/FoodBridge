"use client"

// ML service for food condition assessment

// Define the assessment result type
export interface AssessmentResult {
  condition: "edible" | "expired" | "inedible"
  confidence: number
}

/**
 * Simulated ML model to assess food condition from an image
 * In a real application, this would call an actual ML API
 */
export async function assessFoodCondition(imageUrl: string, foodType: string): Promise<AssessmentResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate a random number to simulate ML model confidence
  const random = Math.random()

  // Adjust probabilities based on food type
  let edibleProb = 0.6
  let expiredProb = 0.3
  let inedibleProb = 0.1

  // Different food types have different shelf lives and spoilage patterns
  switch (foodType) {
    case "cooked":
      edibleProb = 0.5
      expiredProb = 0.4
      inedibleProb = 0.1
      break
    case "raw":
      edibleProb = 0.7
      expiredProb = 0.2
      inedibleProb = 0.1
      break
    case "packaged":
      edibleProb = 0.8
      expiredProb = 0.15
      inedibleProb = 0.05
      break
    case "bakery":
      edibleProb = 0.4
      expiredProb = 0.5
      inedibleProb = 0.1
      break
    case "dairy":
      edibleProb = 0.3
      expiredProb = 0.5
      inedibleProb = 0.2
      break
  }

  // Determine condition based on random value and adjusted probabilities
  let condition: "edible" | "expired" | "inedible"
  let confidence: number

  if (random < edibleProb) {
    condition = "edible"
    confidence = 0.7 + Math.random() * 0.3 // 70-100% confidence
  } else if (random < edibleProb + expiredProb) {
    condition = "expired"
    confidence = 0.6 + Math.random() * 0.3 // 60-90% confidence
  } else {
    condition = "inedible"
    confidence = 0.8 + Math.random() * 0.2 // 80-100% confidence
  }

  return { condition, confidence }
}

/**
 * Determine the appropriate destination based on food condition
 */
export function determineDestination(condition: "edible" | "expired" | "inedible"): "ngo" | "biogas" {
  return condition === "edible" ? "ngo" : "biogas"
}

export type FoodCondition = "edible" | "expired" | "inedible"
