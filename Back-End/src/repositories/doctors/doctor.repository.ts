
import { IDoctorRepository } from "../../interface/doctor/doctor.repo.interface";
import Doctor from "../../models/implementation/doctor.model";
export class DoctorRepository implements IDoctorRepository {
 async uploadDocument(doctorId: string, data: any): Promise<any> {
  return await Doctor.findByIdAndUpdate(
    doctorId,
    {
      $set: {
        profile_img: data.profile_img,
        qualifications: data.qualifications,
      },
    },
    { new: true }
  );
}
}
