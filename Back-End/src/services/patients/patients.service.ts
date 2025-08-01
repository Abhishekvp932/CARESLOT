import { IPatientService } from "../../interface/patients/IPatient.service";

import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";

import { IDoctorAuthRepository } from "../../interface/doctor/doctor.auth.interface";
import { IpatientRepository } from "../../interface/auth/auth.interface";
import { IDoctor } from "../../models/interface/IDoctor";
import { ISlots } from "../../models/interface/ISlots";
import { ISlotRepository } from "../../interface/Slots/slotRepository.interface";
export class PatientService implements IPatientService {
  constructor(
    private _patientRepo: IpatientRepository,
    private _doctorRepo: IDoctorAuthRepository,
    private _slotsRepo:ISlotRepository,
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
  async getAllDoctors(): Promise<IDoctor[]> {
    const doctors = await this._doctorRepo.findAllWithFilter({
      isApproved: true,
    });
    if (!doctors) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    return doctors;
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
    if(!doctor){
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const slots = await this._slotsRepo.findByDoctorId(doctor?._id);


    return slots
  }
}
