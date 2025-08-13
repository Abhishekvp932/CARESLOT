import { IPatientService } from "../../interface/patients/IPatient.service";

import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";

import { IDoctorAuthRepository } from "../../interface/doctor/doctor.auth.interface";
import { IpatientRepository } from "../../interface/auth/auth.interface";
import { IDoctor } from "../../models/interface/IDoctor";
import { ISlots } from "../../models/interface/ISlots";
import { ISlotRepository } from "../../interface/Slots/slotRepository.interface";
import { DoctorDTO } from "../../types/doctor.dto";
import { DoctorListResult } from "../../types/doctorListResult";
import { SpecializationsList } from "../../types/specializationsList";
import logger from "../../utils/logger";
import { hashPassword, comparePassword } from "../../utils/hash";
import { doctorDetails } from "../../types/doctorDetails";
import { UserDTO } from "../../types/user.dto";
export class PatientService implements IPatientService {
  constructor(
    private _patientRepo: IpatientRepository,
    private _doctorRepo: IDoctorAuthRepository,
    private _slotsRepo: ISlotRepository
  ) {}
  async getResendAppoinments(): Promise<{msg:string,doctors:DoctorDTO[]}> {
    const doctorsList = await this._doctorRepo.findAllWithFilter({
      isApproved: true,
    });

    if (!doctorsList) {
      throw new Error("No doctors found");
    }

    const doctors: DoctorDTO[] = doctorsList.map((doctor:IDoctor) => ({
      _id: String(doctor?._id),
      email: doctor?.email,
      isBlocked: doctor?.isBlocked,
      isApproved: doctor?.isApproved,
      name: doctor?.name,
      DOB: doctor?.DOB,
      gender: doctor?.gender,
      role: doctor?.role,
      updatedAt: doctor?.updatedAt,
      createdAt: doctor?.createdAt,
      profile_img: doctor?.profile_img,
      qualifications: {
        degree: doctor?.qualifications?.degree,
        institution: doctor?.qualifications?.institution,
        experince:
          doctor?.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate: doctor?.qualifications?.educationCertificate,
        experienceCertificate: doctor?.qualifications?.experienceCertificate,
        graduationYear:
          doctor?.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor?.qualifications?.specialization,
        medicalSchool: doctor?.qualifications?.medicalSchool,
        about: doctor?.qualifications?.about,
        fees:
          doctor?.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor?.qualifications?.lisence,
      },
    }));

    return {msg:"data fetched",doctors};
  }
  async updateUserProfile(
    formData: any,
    userId: string,
    profileImg?: string
  ): Promise<{msg:string}> {
    const user = await this._patientRepo.findById(userId);

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    await this._patientRepo.updateById(userId, {
      ...formData,
      profile_img: profileImg,
    });

    return { msg: "profile updated successfully" };
  }
  async getUserData(userId: string): Promise<{msg:string,users:UserDTO}> {
    const user = await this._patientRepo.findById(userId);

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    const users= {
      _id: String(user?._id),
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      gender: user?.gender,
      DOB: user?.DOB,
      isBlocked: user?.isBlocked,
      role: user?.role,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      profile_img: user?.profile_img,
    }
    return { msg: "user data fetched successfully", users };
  }

  async getAllDoctors(
    page: number,
    limit: number,
    search: string,
    specialty: string
  ): Promise<DoctorListResult> {
    const skip = (page - 1) * limit;
    const searchFilter = {
      isApproved: true,
      ...(search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              {
                "qualifications.specialization": {
                  $regex: search,
                  $options: "i",
                },
              },
            ],
          }
        : {}),
      ...(specialty && specialty !== "All Specialties"
        ? { "qualifications.specialization": specialty }
        : {}),
    };

    const [doctorList, total] = await Promise.all([
      this._doctorRepo.findAllWithPagination(skip, limit, searchFilter),
      this._doctorRepo.countAll(searchFilter),
    ]);

    if (!doctorList) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const doctors: DoctorDTO[] = doctorList.map((doctor) => ({
      _id: String(doctor?._id),
      email: doctor?.email,
      isBlocked: doctor?.isBlocked,
      isApproved: doctor?.isApproved,
      name: doctor?.name,
      DOB: doctor?.DOB,
      gender: doctor?.gender,
      role: doctor?.role,
      updatedAt: doctor?.updatedAt,
      createdAt: doctor?.createdAt,
      profile_img: doctor?.profile_img,
      qualifications: {
        degree: doctor?.qualifications?.degree,
        institution: doctor?.qualifications?.institution,
        experince:
          doctor?.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate: doctor?.qualifications?.educationCertificate,
        experienceCertificate: doctor?.qualifications?.experienceCertificate,
        graduationYear:
          doctor?.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor?.qualifications?.specialization,
        medicalSchool: doctor?.qualifications?.medicalSchool,
        about: doctor?.qualifications?.about,
        fees:
          doctor?.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor?.qualifications?.lisence,
      },
    }));

    return { doctors, total };
  }

  async getDoctorDetails(doctorId: string): Promise<doctorDetails> {
    const doctors = await this._doctorRepo.findById(doctorId);

    if (!doctors) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

const doctor: doctorDetails = {
  _id: String(doctors._id),
  email: doctors.email,
  name: doctors.name,
  profile_img: doctors.profile_img ?? undefined, 
  qualifications: {
    degree: doctors.qualifications?.degree ?? undefined,
    experince: doctors.qualifications?.experince ?? undefined,
    specialization: doctors.qualifications?.specialization ?? undefined,
    about: doctors.qualifications?.about ?? undefined,
    fees: doctors.qualifications?.fees !== undefined 
          ? Number(doctors.qualifications.fees) 
          : undefined, // convert string to number
  },
};

    return doctor;
  }
  async getDoctorSlots(doctorId: string): Promise<ISlots[]> {
    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const slots = await this._slotsRepo.findByDoctorId(doctorId);

    return slots;
  }

  async getAllspecializations(): Promise<SpecializationsList> {
    const doctorList: IDoctor[] = await this._doctorRepo.findAllWithFilter({
      isApproved: true,
    });
    if (!doctorList) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const specializations: string[] = Array.from(
      new Set<string>(
        doctorList
          .map((doc: IDoctor) => doc?.qualifications?.specialization)
          .filter((spec: string | undefined): spec is string => Boolean(spec))
      )
    );

    return { specializations };
  }
  async getDoctorAndSlot(
    doctorId: string,
    slotId: string
  ): Promise<{ doctor: doctorDetails | null; slot: ISlots | null }> {
    const doctor = await this._doctorRepo.findById(doctorId);
   console.log('docc',doctor);
    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

    const slot = await this._slotsRepo.findById(slotId);

    if (!slot) {
      throw new Error(SERVICE_MESSAGE.SLOT_NOT_FOUND);
    }
    
  const doctors: doctorDetails = {
  _id: String(doctor._id),
  email: doctor.email,
  name: doctor.name,
  profile_img: doctor.profile_img ?? undefined,
  qualifications: {
    degree: doctor.qualifications?.degree ?? undefined,
    experince: doctor.qualifications?.experince !== undefined 
              ? Number(doctor.qualifications.experince) 
              : undefined,
    specialization: doctor.qualifications?.specialization ?? undefined,
    about: doctor.qualifications?.about ?? undefined,
    fees: doctor.qualifications?.fees !== undefined 
          ? Number(doctor.qualifications.fees) 
          : undefined,
  },
};
    
    return { doctor:doctors, slot };
  }

  async getRelatedDoctor(
    doctorId: string,
    specialization: string
  ): Promise<doctorDetails[]> {
    const doctorsList = await this._doctorRepo.findRelatedDoctors(
      specialization,
      doctorId
    );
    if (!doctorsList) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const doctors = doctorsList.map((doctor) => ({
      _id: String(doctor?._id),
      email: doctor?.email,
      isBlocked: doctor?.isBlocked,
      isApproved: doctor?.isApproved,
      name: doctor?.name,
      DOB: doctor?.DOB,
      gender: doctor?.gender,
      role: doctor?.role,
      updatedAt: doctor?.updatedAt,
      createdAt: doctor?.createdAt,
      profile_img: doctor?.profile_img,
      qualifications: {
        degree: doctor?.qualifications?.degree,
        institution: doctor?.qualifications?.institution,
        experince:
          doctor?.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate: doctor?.qualifications?.educationCertificate,
        experienceCertificate: doctor?.qualifications?.experienceCertificate,
        graduationYear:
          doctor?.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor?.qualifications?.specialization,
        medicalSchool: doctor?.qualifications?.medicalSchool,
        about: doctor?.qualifications?.about,
        fees:
          doctor?.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor?.qualifications?.lisence,
      },
    }));

    return doctors;
  }
  async changePassword(
    patientId: string,
    oldPassword: string,
    newPasword: string
  ): Promise<{ msg: string }> {
    const patient = await this._patientRepo.findById(patientId);
    if (!patient) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const isPassword = await comparePassword(oldPassword, patient?.password);

    if (!isPassword) {
      throw new Error(SERVICE_MESSAGE.OLD_PASSWORD_INCORRECT);
    }
    const hashedPassword = await hashPassword(newPasword);
    await this._patientRepo.updateById(patientId, { password: hashedPassword });
    return { msg: "Password Changed" };
  }
}
