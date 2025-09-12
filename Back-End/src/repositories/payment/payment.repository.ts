import Payment from '../../models/implementation/payment.model';
import { IPaymentRepository } from '../../interface/payment/IPaymentRepository';
import { BaseRepository } from '../base.repository';
import { IPayment } from '../../models/interface/IPayment';
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
    
    constructor(){
      super(Payment);
    }
}