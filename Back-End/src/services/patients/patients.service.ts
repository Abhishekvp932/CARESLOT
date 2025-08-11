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
export class PatientService implements IPatientService {
  constructor(
    private _patientRepo: IpatientRepository,
    private _doctorRepo: IDoctorAuthRepository,
    private _slotsRepo: ISlotRepository
  ) {}
  async getResendAppoinments(): Promise<any> {
    const doctors = await this._doctorRepo.findAllWithFilter({
      isApproved: true,
    });

    if (!doctors) {
      throw new Error("No doctors found");
    }

    return { msg: "doctors fetched successfully", doctors };
  }
  async updateUserProfile(
    formData: any,
    userId: string,
    profileImg?: string
  ): Promise<any> {
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
  async getUserData(userId: string): Promise<any> {
    const users = await this._patientRepo.findById(userId);

    if (!users) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
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

  async getDoctorDetails(doctorId: string): Promise<IDoctor> {
    const doctor = await this._doctorRepo.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    return doctor;
  }
  async getDoctorSlots(doctorId: string): Promise<ISlots[]> {
    const doctor = await this._doctorRepo.findById(doctorId);
    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const slots = await this._slotsRepo.findByDoctorId(doctor?._id);

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
}
