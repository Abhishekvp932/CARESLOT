import { z } from "zod";

export const userEdit = z.object({
  profileImg: z
    .instanceof(File)
    .optional()
    .or(z.string().optional()),

  name: z
    .string()
    .min(1, "Name is required")
    .max(20, "Name must be at most 20 characters"),

  email: z.string().email("Invalid email"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(10, "Phone must be 10 digits only"),

  gender: z.enum(["male", "female", "others"], {
    errorMap: () => ({ message: "Select gender" }),
  }),

  dob: z
    .string()
    .refine((val) => {
      if (!val) return false;
      const dob = new Date(val);
      const today = new Date();
      return dob <= today; 
    }, { message: "Date of birth cannot be in the future" }),
});
