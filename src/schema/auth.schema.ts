import { z } from "zod";

export const phoneValidation = z
  .string()
  .min(1, "Phone number is required")
  .startsWith("+91", "Country code is required (e.g., +91)")
  .regex(/^\+91[6-9]\d{9}$/, "Invalid phone number (must be 10 digits)");

export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .trim()
  .email("Please enter a valid email address")
  .transform((val) => val.toLowerCase());

const passwordValidation = z
  .string({ message: "Password is required" })
  .min(6, "Password must be at least 6 characters long")
  .max(16, "Password must be at most 16 characters long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
  );

export const roleEnum = z.enum(["CONTRACTOR", "WORKER"], {
  message: "Please select a role",
});

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  mobile: phoneValidation,
  email: emailValidation,
  password: passwordValidation,
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
