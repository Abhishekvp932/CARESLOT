import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import {
  IDoctor,
  QualificationInput,
} from "../../interface/doctor/doctor.service.interface";
import { DoctorRepository } from "../../repositories/doctors/doctor.repository";
import { PatientRepository } from "../../repositories/auth/auth.repository";
import { DoctorAuthRepository } from "../../repositories/doctors/doctor.auth.repository";
import { MailService } from "../mail.service";

export class DoctorService implements IDoctor {
  constructor(
    private doctorRepo: DoctorRepository,
    private patientRepo: PatientRepository,
    private authDoctor: DoctorAuthRepository
  ) {}
  async uploadDocument(
    doctorId: string,
    input: QualificationInput
  ): Promise<any> {
    const doctor = await this.authDoctor.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    await this.doctorRepo.uploadDocument(doctorId, input);
    const mailService = new MailService();

    await mailService.sendMail(
      doctor.email,
      "Your KYC Documents Have Been Received – CareSlot",
      `Dear Dr. ${doctor.name},

Thank you for submitting your KYC documents to CareSlot. 🩺  
We’ve successfully received your qualification and experience certificates.

Our admin team will now review your documents.  
You’ll be notified once your profile is approved and activated.

✅ Submission Date: ${new Date().toLocaleDateString()}

If you have any questions, feel free to contact our support team careslot@gmail.com.

Best regards,  
The CareSlot Team`
    );

    return { msg: "Document uploaded successfully",doctor};
  }
}
