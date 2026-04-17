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

    if (policy.status === "active") {
      throw new Error("Policy is already active");
    }

    // Simulate Payment Gateway delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simulated transaction details
    const transactionId = `TXN-${Math.floor(Math.random() * 1000000)}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7); // 7-day validity

    // Update policy
    policy.status = "active";
    policy.paymentDetails = {
      method: paymentMethod,
      transactionId,
      paidAt: new Date(),
      amount: policy.weeklyPremium
    };
    policy.validUntil = validUntil;

    await policy.save();

    return {
      success: true,
      policy_status: "ACTIVE",
      transaction_id: transactionId,
      payment_method: paymentMethod
    };
  } catch (error) {
    console.error("[PaymentService] Error:", error.message);
    throw new Error(error.message);
  }
}
