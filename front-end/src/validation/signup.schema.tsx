import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" }),
  
  email: z
    .string()
    .email({ message: "Invalid email format" }),

  dob: z
    .string().min(1, { message: "Date of birth is required" })
    .refine((date) => new Date(date) <= new Date(), {
      message: "Date of Birth cannot be in the future",
    }),

  gender: z
    .enum(["male", "female", "others"], {
      errorMap: () => ({ message: "Select a valid gender" }),
    }),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Phone must be exactly 10 digits" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),

  confirmPassword: z
    .string(),

      role: z.enum(["patients", "doctors"], {
    required_error: "Role is required",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Password must match",
});
