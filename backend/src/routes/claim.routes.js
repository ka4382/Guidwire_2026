import { Router } from "express";

import {
  fileClaimManually,
  getAdminAllClaims,
  getAdminPendingClaims,
  getClaimById,
  getWorkerClaims,
  reviewClaimDecision,
  triggerClaim
} from "../controllers/claim.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { claimReviewSchema, fileClaimSchema, triggerClaimSchema } from "../validators/claim.validator.js";

export const claimRouter = Router();

claimRouter.post("/trigger", requireAuth, validateRequest(triggerClaimSchema), triggerClaim);
claimRouter.post("/file", requireAuth, validateRequest(fileClaimSchema), fileClaimManually);
claimRouter.get("/admin/pending", requireAuth, requireRole("admin"), getAdminPendingClaims);
claimRouter.get("/admin/all", requireAuth, requireRole("admin"), getAdminAllClaims);
claimRouter.get("/details/:claimId", requireAuth, getClaimById);
claimRouter.get("/:workerId", requireAuth, getWorkerClaims);
claimRouter.patch(
  "/:claimId/review",
  requireAuth,
  requireRole("admin"),
  validateRequest(claimReviewSchema),
  reviewClaimDecision
);
