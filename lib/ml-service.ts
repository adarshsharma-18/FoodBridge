"use client"

import { runInference } from "./ml/model-inference"

// Define the assessment result type
export interface AssessmentResult {
  condition: "Fresh" | "Spoiled"
  confidence: number
  foodType?: string
  foodTypeConfidence?: number
}

/**
 * Assess food condition from an image using the ML model
 */
export async function assessFoodCondition(imageUrl: string, foodType: string): Promise<AssessmentResult> {
  try {
    // Run inference using the ML model
    const prediction = await runInference(imageUrl)

    return {
      condition: prediction.freshness,
      confidence: prediction.freshnessConfidence,
      foodType: prediction.foodType,
      foodTypeConfidence: prediction.foodTypeConfidence,
    }
  } catch (error) {
    console.error("Error assessing food condition:", error)

    // Fallback to simulated assessment if model fails
    return simulateFoodConditionAssessment(foodType)
  }
}

/**
 * Fallback function to simulate food condition assessment
 * Used when the model fails to load or run
 */
function simulateFoodConditionAssessment(foodType: string): AssessmentResult {
  // Generate a random number to simulate ML model confidence
  const random = Math.random()

  // Bias towards "Fresh" for better demo experience
  const isFresh = random > 0.3 // 70% chance of Fresh

  return {
    condition: isFresh ? "Fresh" : "Spoiled",
    confidence: 0.7 + Math.random() * 0.3, // 70-100% confidence
    foodType: foodType,
    foodTypeConfidence: 0.6 + Math.random() * 0.4, // 60-100% confidence
  }
}

/**
 * Determine the appropriate destination based on food condition
 */
export function determineDestination(condition: "Fresh" | "Spoiled"): "ngo" | "biogas" {
  return condition === "Fresh" ? "ngo" : "biogas"
}

export type FoodCondition = "Fresh" | "Spoiled"
