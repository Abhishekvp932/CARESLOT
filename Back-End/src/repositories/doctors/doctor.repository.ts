import { IDoctorRepository } from "../../interface/doctor/doctor.repo.interface";
import Doctor from "../../models/implementation/doctor.model";
export class DoctorRepository implements IDoctorRepository {
  async uploadDocument(doctorId: string, qualification: any): Promise<any> {
    return await Doctor.findByIdAndUpdate(
      doctorId,
      { qualifications: qualification },
      { new: true }
    );
  }
}
