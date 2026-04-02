import { z } from "zod";
export const mobileValidation = z
  .string("Mobile number is required")
  .trim()
  .min(1, "mobile number is required")
  .regex(/^[6-9]\d{9}$/, "Mobile number must be a valid.");
export const createClientSchema = z.object({
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters"),
  mobile: mobileValidation,
  address: z
    .object({
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string("City is required").optional(),
      state: z.string("State is required").optional(),
      pincode: z.string("Pincode is required").optional(),
      country: z.string("Country is required").optional(),
    })
    .optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(3).optional(),
  mobile: mobileValidation.optional(),
  address: z
    .object({
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

export interface Client {
  id: string;
  name: string;
  mobile: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: any;
}
