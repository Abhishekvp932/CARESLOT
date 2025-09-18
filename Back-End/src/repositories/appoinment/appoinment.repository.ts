import { IAppoinment } from '../../models/interface/IAppoinments';
import Appoinment from '../../models/implementation/appoinment.model';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import { Types } from 'mongoose';

import { IPatientPopulated } from '../../types/AppointsAndPatientsDto';
import { IDoctorPopulated } from '../../types/AppoinmentsAndDoctorDto';
import { AppoinmentPopulatedDTO } from '../../types/AppoinmentDTO';



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

     async findByIdAndUpdate(appoinmentId: string | Types.ObjectId, update: Partial<IAppoinment>): Promise<IAppoinment | null> {
         return await Appoinment.findByIdAndUpdate(appoinmentId ,update,{new:true});
     }

     async findAppoinmentsByDoctor(doctorId: string,skip:number,limit:number): Promise<(IAppoinment & {patientId:IPatientPopulated})[]> {
       const appointments = await Appoinment.find({ doctorId })
    .populate('patientId', '_id name email phone profile_img')
    .sort({createdAt:1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
      return appointments as unknown as (IAppoinment & { patientId: IPatientPopulated })[];
     }
     async findAppoinmentsByPatient(patientId: string,skip:number,limit:number): Promise<(IAppoinment & {doctorId:IDoctorPopulated})[]> {
         const appoinments =  await Appoinment.find({patientId:patientId})
         .populate('doctorId','_id name email phone profile_img qualifications.fees qualifications.specialization')
          .sort({createdAt:1})
         .skip(skip)
         .limit(limit)
         .lean()
         .exec();

         return appoinments as unknown as (IAppoinment & {doctorId:IDoctorPopulated})[];
     }

     async findAll(): Promise<AppoinmentPopulatedDTO[]> {
         const appoinment = await Appoinment.find()
         .populate('doctorId','_id name email phone profile_img qualifications.fees qualifications.specialization')
         .populate('patientId', '_id name email phone profile_img')
         .lean()
         .exec();

         return appoinment as unknown as  AppoinmentPopulatedDTO[];
     }

     async countPatientAppoinment(patientId: string): Promise<number> {
         return await Appoinment.countDocuments({patientId:patientId});
     }
     async countDoctorAppoinment(doctorId: string): Promise<number> {
         return await Appoinment.countDocuments({doctorId:doctorId});
     }
}