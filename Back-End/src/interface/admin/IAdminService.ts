import { IDoctor } from '../../models/interface/IDoctor';
import { DoctorListResult } from '../../types/doctorListResult';
import { UserListResult } from '../../types/userListsResult';
import { doctorDetails } from '../../types/doctorDetails';
import { IPatient } from '../../models/interface/IPatient';
import { AppoinmentPopulatedDTO } from '../../types/AppoinmentDTO';
import { AppointmentPatientDTO } from '../../types/AppointsAndPatientsDto';
import { ISlotDto } from '../../types/ISlotDTO';
import { DashboardData } from '../../types/IAdminDashboardDataLookup';
import { IRatingDTO } from '../../types/ratingPatientDTO';
export interface IAdminService {
  findAllUsers(page:number,limit:number,search:string): Promise<UserListResult>;
  findAllDoctors(page:number,limit:number,search:string): Promise<DoctorListResult>;
  blockAndUnblockUsers(userId: string, update: boolean): Promise<{msg:string}>;
  blockAndUnblockDoctors(doctorId: string, update: boolean,reason:string): Promise<{msg:string}>;
  findUnApprovedDoctors(page:number,limit:number,search:string): Promise<DoctorListResult>;
  doctorApprove(doctorId: string): Promise<{msg:string}>;
  doctorReject(doctorId: string,reason:string): Promise<{msg:string}>;
  getVerificationDoctorDetails(doctorId: string): Promise<doctorDetails>;
  updateUserData(
    formData: Partial<IPatient>,
    userId: string,
    profileImage?: string
  ): Promise<{msg:string}>;
  editDoctorData(doctorId: string): Promise<doctorDetails>;

  editDoctorProfile(
    doctorId: string,
    data: Partial<IDoctor>
  ): Promise<{ msg: string }>;

  addUser(
    name: string,
    email: string,
    phone: string,
    gender:string,
    dob: Date,
    password: string,
    profileImage?:string
  ): Promise<{ msg: string }>;

addDoctor(data:unknown):Promise<{msg:string}>

getAllAppoinments(status:string):Promise<AppoinmentPopulatedDTO[]>

getDoctorSlotAndAppoinment(doctorId:string):Promise<{slots:ISlotDto[],appoinments:AppointmentPatientDTO[],ratings:IRatingDTO[]}>
getAdminDashboardData(filter:string):Promise<DashboardData>;

}
