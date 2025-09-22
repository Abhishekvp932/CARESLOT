import { INotification } from '../../models/interface/INotification';
import { RazorpayOrder } from '../../utils/RazorpayOrder';

export interface IPaymentService {
  createOrder(amount: number): Promise<RazorpayOrder>;
  verifyOrder(
    orderId: string,
    paymentId: string,
    signature: string,
    doctorId: string,
    patientId: string,
    date: string,
    startTime: string,
    endTime: string,
    amount: string,
    paymentMethod:string
  ): Promise<{ status: string,patientNotification:INotification | null,doctorNotification:INotification | null }>;

  walletPayment(doctorId:string,date:string,startTime:string,endTime:string,patientId:string,amount:string):
  Promise<{status:string,patientNotification:INotification | null,doctorNotification:INotification | null}>;


}
