import { IAppoinment } from '../../models/interface/IAppoinments';
import Appoinment from '../../models/implementation/appoinment.model';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';


export class AppoinmentRepository implements IAppoinmentRepository {
    async create(data: Partial<IAppoinment>): Promise<IAppoinment | null> {
        const newAppoinment = new Appoinment(data);
        return await newAppoinment.save();
    }

    async findByDoctorId(doctorId: string): Promise<IAppoinment[]> {
        return await Appoinment.find({doctorId:doctorId});
    }
    async findById(id: string): Promise<IAppoinment | null> {
        return await Appoinment.findById(id);
    }
    async findByPatientId(patientId: string): Promise<IAppoinment[]> {
        return await Appoinment.find({patientId:patientId});
     }

}