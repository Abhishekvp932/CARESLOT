import { IAppoinment } from '../../models/interface/IAppoinments';

import { IPatient } from '../../models/interface/IPatient';

import { AppointmentDoctorDTO } from '../../types/AppoinmentsAndDoctorDto';
import { DoctorDTO } from '../../types/doctor.dto';
import { doctorDetails } from '../../types/doctorDetails';
import { DoctorListResult } from '../../types/doctorListResult';
import { IGeneratedSlot } from '../../types/SlotTypes';
import { SpecializationsList } from '../../types/specializationsList';
import { UserDTO } from '../../types/user.dto';

export interface IPatientService {

    getResendAppoinments(patientId:string):Promise<{msg:string,doctors:DoctorDTO[],appoinments:IAppoinment[]}>
    updateUserProfile(formData:Partial<IPatient>,userId:string,profileImg?:string):Promise<{msg:string}>
    getUserData(userId:string):Promise<{msg:string,users:UserDTO}>
    getAllDoctors(page:number,limit:number,search:string,specialty:string):Promise<DoctorListResult>
    getDoctorDetails(doctorId:string):Promise<doctorDetails>
    getDoctorSlots(doctorId:string,targetDate:string):Promise<IGeneratedSlot[]>
    getAllspecializations():Promise<SpecializationsList>
    getDoctorAndSlot(doctorId:string):Promise<{doctor:doctorDetails | null}>
    getRelatedDoctor(doctorId:string,specialization:string):Promise<doctorDetails[]>
    changePassword(patientId:string,oldPassword:string,newPassword:string):Promise<{msg:string}>
    getAllAppoinments(patientId:string,page:number,limit:number):Promise<{appoinments:AppointmentDoctorDTO[],total:number}>
}
