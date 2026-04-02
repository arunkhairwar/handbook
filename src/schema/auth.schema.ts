import { z } from "zod";

export const phoneValidation = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number");

export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .trim()
  .email("Please enter a valid email address")
  .transform((val) => val.toLowerCase());

export const roleEnum = z.enum(["CONTRACTOR", "WORKER"], {
  message: "Please select a role",
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  mobile: phoneValidation,
  email: emailValidation,
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: roleEnum,
});

export const loginSchema = z.object({
  email: emailValidation,
  // phone: phoneValidation,
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
