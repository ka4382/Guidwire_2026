import { Router } from "express";

import {
  activateWorkerPolicy,
  cancelWorkerPolicy,
  createWorkerPolicy,
  getWorkerPolicies
} from "../controllers/policy.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { createPolicySchema } from "../validators/policy.validator.js";

export const policyRouter = Router();

policyRouter.post("/", requireAuth, validateRequest(createPolicySchema), createWorkerPolicy);
policyRouter.patch("/:policyId/activate", requireAuth, activateWorkerPolicy);
policyRouter.patch("/:policyId/cancel", requireAuth, cancelWorkerPolicy);
policyRouter.get("/:workerId", requireAuth, getWorkerPolicies);

