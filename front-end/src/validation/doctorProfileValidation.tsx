import { z } from "zod";

export const doctorProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(15, "Name must be at most 15 characters"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone number too long"),
  DOB: z.string().optional(),
  gender: z.string().optional(),

  qualifications: z.object({
    degree: z.string().min(1, "Degree is required"),
    institution: z.string().min(1, "Institution is required"),
    specialization: z.string().min(1, "Specialization is required"),
    medicalSchool: z.string().min(1, "Medical school is required"),
    experince: z
      .number()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Experience must be a valid number",
      }),
    graduationYear: z.number().optional(),
    fees: z
      .number()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Fees must be a positive number",
      }),
    lisence: z.string().min(1, "License is required"),
    about: z.string().min(10, "Bio must be at least 10 characters"),
  }),
});
