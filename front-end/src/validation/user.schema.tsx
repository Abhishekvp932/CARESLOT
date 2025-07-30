import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be 10 digits"),
  gender: z.union([
    z.literal("male"),
    z.literal("female"),
    z.literal("others"),
  ]).refine((val) => val !== "", {
    message: "Gender is required",
  }),
  DOB: z.string().min(1, "DOB is required"),
  profileImg: z.any().optional(),
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
