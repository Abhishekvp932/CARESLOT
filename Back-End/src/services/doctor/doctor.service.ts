import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import {
  IDoctor,
  QualificationInput,
} from "../../interface/doctor/doctor.service.interface";

import { MailService } from "../mail.service";
import { DoctorProfileInput } from "../../types/doctor";
import { UploadedFiles } from "../../types/doctor";

import { IDoctorRepository } from "../../interface/doctor/doctor.repo.interface";
import { IpatientRepository } from "../../interface/auth/auth.interface";
import { IDoctorAuthRepository } from "../../interface/doctor/doctor.auth.interface";
import { IDoctor as IDoctorData } from "../../models/interface/IDoctor";

export class DoctorService implements IDoctor {
  constructor(
    private _doctorRepo: IDoctorRepository,
    private _patientRepo: IpatientRepository,
    private _authDoctor: IDoctorAuthRepository
  ) {}
  async uploadDocument(
    doctorId: string,
    input: QualificationInput,
    profileImage:string
  ): Promise<any> {
    const doctor = await this._authDoctor.findById(doctorId);
     
    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    await this._doctorRepo.uploadDocument(doctorId, {profile_img:profileImage,qualifications:input});
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

  async getDoctorProfile(doctorId:string): Promise<{msg:string,doctor:IDoctorData}> {
    const doctor = await this._authDoctor.findById(doctorId);
    if(!doctor){
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    
    return {msg:"doctor Data fetched successfully",doctor}
  }
  async editDoctorProfile(doctorId: string, body:DoctorProfileInput, files: UploadedFiles): Promise<{ msg: string; }> {
  const doctor = await this._authDoctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  const {
    name,
    email,
    phone,
    DOB,
    gender,
    degree,
    institution,
    specialization,
    medicalSchool,
    experince,
    graduationYear,
    fees,
    license,
    about,
  } = body;

  const updatedDoctor: Partial<IDoctorData> = {
    name: name || doctor.name,
    email: email || doctor.email,
    phone: phone || doctor.phone,
    DOB: DOB ? new Date(DOB) : doctor.DOB,
    gender: gender || doctor.gender,
    profile_img: files?.profileImage?.[0]?.path || doctor.profile_img,
   qualifications: {
        degree: degree ?? doctor.qualifications?.degree ?? "",
        institution: institution ?? doctor.qualifications?.institution ?? "",
        specialization: specialization ?? doctor.qualifications?.specialization ?? "",
        medicalSchool: medicalSchool ?? doctor.qualifications?.medicalSchool ?? "",
        experince: experince ? Number(experince) : doctor.qualifications?.experince ?? 0,
        graduationYear: graduationYear
          ? Number(graduationYear)
          : doctor.qualifications?.graduationYear ?? 0,
        fees: fees ?? doctor.qualifications?.fees ?? "",
        lisence: license ?? doctor.qualifications?.lisence ?? "",
        about: about ?? doctor.qualifications?.about ?? "",
        educationCertificate:
          files?.educationCertificate?.[0]?.path ??
          doctor.qualifications?.educationCertificate ??
          "",
        experienceCertificate:
          files?.experienceCertificate?.[0]?.path ??
          doctor.qualifications?.experienceCertificate ??
          "",
      },
  };

  await this._authDoctor.updateById(doctorId, updatedDoctor);
    return {msg:'Profile updated'}
  }
}
