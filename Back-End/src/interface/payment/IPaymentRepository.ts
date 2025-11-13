import { ClientSession } from 'mongoose';
import { IPayment } from '../../models/interface/IPayment';

export interface IPaymentRepository {
    create(payment : Partial <IPayment>,session?:ClientSession):Promise<IPayment>;
}