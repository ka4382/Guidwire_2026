/**
 * payment.controller.js
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import { processPolicyPayment } from "../services/payment.service.js";

// @route   POST /api/payment/simulate
// @desc    Simulate payment and activate policy
// @access  Private
export const simulatePayment = asyncHandler(async (req, res) => {
  const { policyId, method } = req.body;

  if (!policyId) {
    res.status(400);
    throw new Error("Please provide policyId");
  }

  const result = await processPolicyPayment(policyId, method || "upi");

  res.status(200).json({
    success: true,
    data: result
  });
});
