import { Router } from "express";

import {
  calculatePremiumQuote,
  getLatestPremiumQuote
} from "../controllers/premium.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { premiumCalculationSchema } from "../validators/premium.validator.js";

export const premiumRouter = Router();

premiumRouter.post("/calculate", requireAuth, validateRequest(premiumCalculationSchema), calculatePremiumQuote);
premiumRouter.get("/:workerId/latest", requireAuth, getLatestPremiumQuote);

