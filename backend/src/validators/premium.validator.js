import { z } from "zod";

export const premiumCalculationSchema = z.object({
  workerId: z.string().min(12)
});

