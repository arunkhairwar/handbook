import { z } from "zod";

const updateUserProfileSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  availableForWork: z.boolean(),
  address: z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    country: z.string().optional(),
  }),
});

export type UpdateUserProfileFormData = z.infer<typeof updateUserProfileSchema>;
