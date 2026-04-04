import { z } from "zod";

export const updateWorkerSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  city: z.string().min(2).optional(),
  assignedZone: z.string().min(2).optional(),
  darkStoreId: z.string().min(2).optional(),
  payoutMethod: z
    .object({
      provider: z.string().optional(),
      upiId: z.string().optional(),
      accountName: z.string().optional()
    })
    .optional(),
  vehicleType: z.string().optional(),
  avgWeeklyEarnings: z.number().positive().optional(),
  avgDailyHours: z.number().positive().optional(),
  preferredShift: z.string().optional(),
  activityScore: z.number().min(0).max(1).optional()
});

