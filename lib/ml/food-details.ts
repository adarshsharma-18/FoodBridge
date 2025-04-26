/**
 * This module uses Mistral AI to get additional details about food items
 */

// Define food type categories based on the food name
const FOOD_TYPE_MAPPING: Record<string, string> = {
  // Ready-to-Eat Snacks
  samosa: "Ready-to-Eat Snacks",
  pakode: "Ready-to-Eat Snacks",
  momos: "Ready-to-Eat Snacks",
  paani_puri: "Ready-to-Eat Snacks",

  // Sweet Dishes
  jalebi: "Sweet Dishes",
  kulfi: "Sweet Dishes",

  // Beverages
  chai: "Beverages",

  // Street Food
  pav_bhaji: "Street Food",
  chole_bhature: "Street Food",
  kaathi_rolls: "Street Food",

  // Default mappings for other foods
  burger: "Ready-to-Eat Snacks",
  butter_naan: "Staples",
  chapati: "Staples",
  dal_makhani: "Cooked Food",
  dhokla: "Ready-to-Eat Snacks",
  fried_rice: "Cooked Food",
  idli: "Cooked Food",
  kadai_paneer: "Cooked Food",
  masala_dosa: "Cooked Food",
  pizza: "Ready-to-Eat Snacks",
}

// Define typical conditions for different food types
const FOOD_CONDITION_MAPPING: Record<string, "fresh" | "good" | "staple"> = {
  // Fresh foods (newly prepared, highest quality)
  chai: "fresh",
  idli: "fresh",
  masala_dosa: "fresh",
  chole_bhature: "fresh",
  pav_bhaji: "fresh",
  momos: "fresh",

  // Good foods (slightly older but safe if stored properly)
  dal_makhani: "good",
  kadai_paneer: "good",
  jalebi: "good",
  kulfi: "good",
  fried_rice: "good",
  burger: "good",
  pizza: "good",
  kaathi_rolls: "good",
  samosa: "good",
  pakode: "good",
  paani_puri: "good",

  // Staple foods (dry/long-shelf-life items)
  butter_naan: "staple",
  chapati: "staple",
  dhokla: "staple",
}

/**
 * Simulates a call to Mistral AI to get food details
 * In a real implementation, this would make an API call to Mistral
 */
export async function getFoodDetails(foodName: string): Promise<{
  foodType: string
  condition: "fresh" | "good" | "staple"
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Get food type from mapping or use a default
  const foodType = FOOD_TYPE_MAPPING[foodName] || "Other"

  // Get condition from mapping or use a default based on food type
  const condition: "fresh" | "good" | "staple" = FOOD_CONDITION_MAPPING[foodName] || "good"

  // In a real implementation, we would call Mistral AI here
  // const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
  //   },
  //   body: JSON.stringify({
  //     model: 'mistral-medium',
  //     messages: [
  //       {
  //         role: 'system',
  //         content: 'You are a food expert. Analyze the food and provide its type and condition.'
  //       },
  //       {
  //         role: 'user',
  //         content: `What is the food type and condition of ${foodName.replace(/_/g, ' ')}?`
  //       }
  //     ]
  //   })
  // });
  // const data = await response.json();
  // Parse the response to extract food type and condition

  return {
    foodType,
    condition,
  }
}
