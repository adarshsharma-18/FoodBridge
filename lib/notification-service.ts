import { addNotification, type Notification } from "./notification"

/**
 * Send notification to NGO about food condition
 * @param ngoId NGO identifier
 * @param donationId Donation identifier
 * @param condition Food condition
 * @param redirected Whether the food was redirected to biogas
 */
export function notifyNGO(
  ngoId: string,
  donationId: string,
  condition: "Fresh" | "Spoiled",
  isRedirected: boolean,
): Notification {
  let title: string
  let message: string

  if (isRedirected) {
    title = "Donation Redirected"
    message = `Donation #${donationId.slice(-8)} has been redirected to a biogas plant due to Spoiled condition.`
  } else if (condition === "Fresh") {
    title = "Food Condition Verified"
    message = `Donation #${donationId.slice(-8)} has been verified as Fresh and is on its way to you.`
  } else {
    title = "Food Condition Alert"
    message = `Donation #${donationId.slice(-8)} has been found to be in Spoiled condition.`
  }

  return addNotification({
    userId: ngoId,
    type: "food_condition",
    title,
    message,
    metadata: {
      donationId,
      condition,
      isRedirected,
    },
  })
}

/**
 * Send notification to biogas plant about redirected food
 * @param biogasId Biogas plant identifier
 * @param donationId Donation identifier
 * @param condition Food condition
 */
export function notifyBiogasPlant(
  biogasPlantId: string,
  donationId: string,
  condition: "Fresh" | "Spoiled",
): Notification {
  return addNotification({
    userId: biogasPlantId,
    type: "pickup_request",
    title: "New Waste Donation",
    message: `A new ${condition === "Fresh" ? "edible but expired" : "spoiled"} food donation #${donationId.slice(-8)} has been redirected to your facility.`,
    metadata: {
      donationId,
      condition,
    },
  })
}

/**
 * Send notification to driver about assigned pickup
 * @param driverId Driver identifier
 * @param donationId Donation identifier
 * @param destination Destination type
 */
export function notifyDriver(driverId: string, donationId: string, destination: "ngo" | "biogas"): Notification {
  const destinationText = destination === "ngo" ? "NGO" : "Biogas Plant"
  return addNotification({
    userId: driverId,
    type: "pickup_assigned",
    title: "New Pickup Assigned",
    message: `You have been assigned to pickup donation #${donationId.slice(-8)} for ${destinationText}.`,
    metadata: {
      donationId,
      destination,
    },
  })
}
