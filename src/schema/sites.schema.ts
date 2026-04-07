import { z } from "zod";
export const createSiteSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(3, "Name must be at least 3 characters"),
  image: z.string().optional(),
  estimatedBudget: z.number().optional(),
  startDate: z.date().optional(),
  expectedEndDate: z.date().optional(),
  client: z.string("Client ID is required"),
  address: z
    .object({
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string("City is required"),
      state: z.string("State is required"),
      pincode: z.string("Pincode is required"),
      country: z.string("Country is required"),
    })
    .optional(),
});
