import { z } from "zod";

export const simulateDisruptionSchema = z.object({
  type: z.enum([
    "heavy_rainfall",
    "extreme_heat",
    "severe_pollution",
    "zone_restriction",
    "platform_outage",
    "gps_spoof_attack"
  ]),
  zone: z.string().min(2),
  darkStoreId: z.string().min(2).optional(),
  durationHours: z.number().int().positive().max(12).optional(),
  severity: z.enum(["medium", "high", "critical"]).optional()
});

