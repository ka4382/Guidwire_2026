import { z } from "zod";

export const triggerClaimSchema = z.object({
  workerId: z.string().min(12),
  disruptionEventId: z.string().min(12)
});

export const fileClaimSchema = z.object({
  workerId: z.string().min(12),
  eventType: z.enum([
    "heavy_rainfall",
    "extreme_heat",
    "severe_aqi",
    "zone_closure",
    "platform_outage",
    "unplanned_curfew",
    "local_strike",
    "market_closure"
  ]),
  description: z.string().min(5).max(500),
  zone: z.string().optional()
});

export const claimReviewSchema = z.object({
  action: z.enum(["approve", "reject", "clear_flag"]),
  notes: z.string().optional()
});

export const payoutProcessSchema = z.object({
  claimId: z.string().min(12)
});
