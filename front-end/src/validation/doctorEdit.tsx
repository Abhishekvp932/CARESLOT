import { z } from "zod";
import { kyc_schema } from "./kyc.schema";
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  DOB: z.string().min(1, "Date of birth required"),
  gender: z.enum(["male", "female", "others"], {
    errorMap: () => ({ message: "Select gender" }),
  })
});

export const doctorSchema = personalInfoSchema.extend({
  qualifications: kyc_schema,
});
