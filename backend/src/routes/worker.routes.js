import { Router } from "express";

import {
  getWorkerActivityById,
  getWorkerById,
  updateWorkerById
} from "../controllers/worker.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { updateWorkerSchema } from "../validators/worker.validator.js";

export const workerRouter = Router();

workerRouter.get("/:id", requireAuth, getWorkerById);
workerRouter.put("/:id", requireAuth, validateRequest(updateWorkerSchema), updateWorkerById);
workerRouter.get("/:id/activity", requireAuth, getWorkerActivityById);

