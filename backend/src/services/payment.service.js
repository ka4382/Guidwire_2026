/**
 * payment.service.js
 *
 * Mock payment processor for Hackathon demo.
 * Updates the policy to ACTIVE once payment succeeds.
 */

import { Policy } from "../models/Policy.js";

/**
 * Process a simulated payment and activate the policy.
 * @param {string} policyId
 * @param {string} paymentMethod - 'upi' | 'card'
 * @returns {Promise<object>} Transaction details
 */
export async function processPolicyPayment(policyId, paymentMethod) {
  try {
    const policy = await Policy.findById(policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }

    // Use findByIdAndUpdate to ensure atomic update and return the NEW document
    const updatedPolicy = await Policy.findByIdAndUpdate(
      policyId,
      {
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        paymentMethod,
        transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`
      },
      { new: true }
    );

    console.log("[PaymentService] Policy activated:", updatedPolicy._id);

    return {
      success: true,
      data: updatedPolicy
    };
  } catch (error) {
    console.error("[PaymentService] Error:", error.message);
    throw new Error(error.message);
  }
}
