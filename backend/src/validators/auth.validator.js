import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["worker", "admin"]).optional(),
  city: z.string().min(2),
  assignedZone: z.string().min(2),
  darkStoreId: z.string().min(2),
  payoutMethod: z
    .object({
      provider: z.string().optional(),
      upiId: z.string().optional(),
      accountName: z.string().optional()
    })
    .optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

