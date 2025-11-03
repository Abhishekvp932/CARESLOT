import { ClientSession, FilterQuery, Types } from 'mongoose';
import { IAppoinment } from '../../models/interface/IAppoinments';
import { IPatientPopulated } from '../../types/AppointsAndPatientsDto';
import { IDoctorPopulated } from '../../types/AppoinmentsAndDoctorDto';
import { AppoinmentPopulatedDTO } from '../../types/AppoinmentDTO';
import { DashboardData } from '../../types/IAdminDashboardDataLookup';
import { DoctorDashboardData } from '../../types/IDoctorDashboardDto';
export interface IAppoinmentRepository{
    create(data:Partial<IAppoinment>,session?:ClientSession):Promise<IAppoinment | null>;
    findById(id:string):Promise<IAppoinment | null>;
    findByDoctorId(doctorId:string):Promise<IAppoinment[]>;
    findByPatientId(patientId:string):Promise<IAppoinment[]>;
    findByIdAndUpdate(appoinmentId:string | Types.ObjectId,update:Partial<IAppoinment>):Promise<IAppoinment | null>;
    findAppoinmentsByDoctor(doctorId:string,skip:number,limit:number,filter?:FilterQuery<IAppoinment>):Promise<(IAppoinment & {patientId:IPatientPopulated})[]>;
    findAppoinmentsByPatient(patientId:string,skip:number,limit:number):Promise<(IAppoinment & {doctorId:IDoctorPopulated})[]>;
    findAll(filter:FilterQuery<IAppoinment>):Promise<AppoinmentPopulatedDTO[]>;
    countPatientAppoinment(patientId:string):Promise<number>;
    countDoctorAppoinment(doctorId:string):Promise<number>;
    findByOneSlot(doctorId:string,slotDate:string,startTime:string,session?:ClientSession):Promise<IAppoinment | null>;
    findPatientActiveAppoinments(patientId:string,doctorId:string):Promise<IAppoinment[]>;
    adminDashboardData(filter:FilterQuery<IAppoinment>):Promise<DashboardData>;
    doctorDashboardData(doctorId:string,filter?:FilterQuery<IAppoinment>):Promise<DoctorDashboardData>;
}