import { Types } from 'mongoose';
import { IAppoinment } from '../../models/interface/IAppoinments';
import { IPatientPopulated } from '../../types/AppointsAndPatientsDto';
import { IDoctorPopulated } from '../../types/AppoinmentsAndDoctorDto';
import { AppoinmentPopulatedDTO } from '../../types/AppoinmentDTO';
export interface IAppoinmentRepository{
    create(data:Partial<IAppoinment>):Promise<IAppoinment | null>;
    findById(id:string):Promise<IAppoinment | null>;
    findByDoctorId(doctorId:string):Promise<IAppoinment[]>;
    findByPatientId(patientId:string):Promise<IAppoinment[]>;
    findByIdAndUpdate(appoinmentId:string | Types.ObjectId,update:Partial<IAppoinment>):Promise<IAppoinment | null>;
    findAppoinmentsByDoctor(doctorId:string):Promise<(IAppoinment & {patientId:IPatientPopulated})[]>;
    findAppoinmentsByPatient(patientId:string):Promise<(IAppoinment & {doctorId:IDoctorPopulated})[]>;
    findAll():Promise<AppoinmentPopulatedDTO[]>
}