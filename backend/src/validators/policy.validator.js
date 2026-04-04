import { z } from "zod";

export const createPolicySchema = z.object({
  workerId: z.string().min(12),
  startDate: z.string().datetime().optional()
});

