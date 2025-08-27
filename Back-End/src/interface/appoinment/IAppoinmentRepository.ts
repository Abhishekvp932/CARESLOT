import { IAppoinment } from '../../models/interface/IAppoinments';

export interface IAppoinmentRepository{
    create(data:Partial<IAppoinment>):Promise<IAppoinment | null>;
    findById(id:string):Promise<IAppoinment | null>;
    findByDoctorId(doctorId:string):Promise<IAppoinment[]>;
    findByPatientId(patientId:string):Promise<IAppoinment[]>;
}