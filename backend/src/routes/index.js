import { Router } from "express";

import { analyticsRouter } from "./analytics.routes.js";
import { authRouter } from "./auth.routes.js";
import { claimRouter } from "./claim.routes.js";
import { disruptionRouter } from "./disruption.routes.js";
import { payoutRouter } from "./payout.routes.js";
import { policyRouter } from "./policy.routes.js";
import { premiumRouter } from "./premium.routes.js";
import { workerRouter } from "./worker.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { simulationRouter } from "./simulation.routes.js";
import { paymentRouter } from "./payment.routes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/workers", workerRouter);
router.use("/premium", premiumRouter);
router.use("/policies", policyRouter);
router.use("/disruptions", disruptionRouter);
router.use("/claims", claimRouter);
router.use("/payouts", payoutRouter);
router.use("/analytics", analyticsRouter);

// ── Phase 3: Dashboard & Simulation ────────────────────────────────
router.use("/dashboard", dashboardRouter);
router.use("/simulation", simulationRouter);

// ── Hackathon: Payment & Activation ────────────────────────────────
router.use("/payment", paymentRouter);

