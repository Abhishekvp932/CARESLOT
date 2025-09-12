import { IPayment } from '../../models/interface/IPayment';

export interface IPaymentRepository {
    create(payment : Partial <IPayment>):Promise<IPayment>;
}