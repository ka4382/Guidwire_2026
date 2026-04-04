import { Router } from "express";

import { getWorkerPayouts, processPayout } from "../controllers/payout.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { payoutProcessSchema } from "../validators/claim.validator.js";

export const payoutRouter = Router();

payoutRouter.post("/process", requireAuth, validateRequest(payoutProcessSchema), processPayout);
payoutRouter.get("/:workerId", requireAuth, getWorkerPayouts);

