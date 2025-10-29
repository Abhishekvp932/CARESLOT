import { IPrescription } from '../../models/interface/IPrescription';
import { PrescriptionDTO } from '../../types/PrescriptionDTO';

export interface IPrecriptionRepository{
    create(prescriptionData:Partial<IPrescription>):Promise<IPrescription | null>;
    findByAppoinmentId(appoinmentId:string):Promise<PrescriptionDTO>;
}