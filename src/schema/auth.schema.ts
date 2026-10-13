import { z } from "zod";

export const phoneValidation = z
  .string()
  .min(1, "Phone number is required")
  .startsWith("+91", "Country code is required (e.g., +91)")
  .regex(/^\+91[6-9]\d{9}$/, "Invalid phone number (must be 10 digits)");

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required").trim(),
  phone: phoneValidation,
});

export const loginSchema = z.object({
  phone: phoneValidation,
});

export const verifyOtpSchema = z.object({
  phone: phoneValidation,
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain digits only"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
