import { z } from "zod";

export const kyc_schema = z.object({
  degree: z.string().min(2, { message: "Degree is required" }),
  institution: z.string().min(3, { message: "Enter your institution" }),
  experience: z
    .number({
      required_error: "Experience is required",
      invalid_type_error: "Experience must be a number",
    })
    .min(0, "Experience must be a positive number"),
  specialization: z.string().min(1, { message: "Select a specialization" }),
  medicalSchool: z.string().min(3, { message: "Enter medical school" }),
  graduationYear: z
    .number({
      required_error: "Graduation year is required",
      invalid_type_error: "Graduation year must be a number",
    })
    .refine(
      (val) => val >= 1950 && val <= new Date().getFullYear(),
      "Invalid graduation year"
    ),

  about: z
    .string()
    .min(10, { message: "Please write something about yourself" }),
  fees: z
    .string()
    .regex(/^₹?\d+$/, { message: "Enter valid fees (e.g. ₹500)" })
    .optional(),

  educationCertificate: z.any().optional(),
  experienceCertificate: z.any().optional(),
});
