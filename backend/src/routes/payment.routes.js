import express from "express";
import { simulatePayment } from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/simulate", requireAuth, simulatePayment);

export { router as paymentRouter };
