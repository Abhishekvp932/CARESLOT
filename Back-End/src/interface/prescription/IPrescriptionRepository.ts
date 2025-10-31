import { UpdateQuery } from 'mongoose';
import { IPrescription } from '../../models/interface/IPrescription';
import { PrescriptionDTO } from '../../types/PrescriptionDTO';

export interface IPrecriptionRepository{
    create(prescriptionData:Partial<IPrescription>):Promise<IPrescription | null>;
    findByAppoinmentId(appoinmentId:string):Promise<PrescriptionDTO>;
    findByAppoinmentIdAndUpdate(appoinmentId:string,update:UpdateQuery<IPrescription>):Promise<IPrescription | null>;
    findOneAppoinmentId(appoinmentId:string):Promise<IPrescription | null>;
}