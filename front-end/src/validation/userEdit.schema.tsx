import { z } from "zod";

export const userEdit = z.object({
  profileImg: z
    .instanceof(File)
    .optional()
    .or(z.string().optional()), 
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  gender: z.enum(["male", "female", "others"], { errorMap: () => ({ message: "Select gender" }) }),
  dob: z
    .string()
    .refine((val) => Boolean(val), { message: "Date of birth is required" }),
});
