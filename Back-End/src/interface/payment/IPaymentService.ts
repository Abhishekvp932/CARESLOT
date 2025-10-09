
import { INotificationDto } from '../../types/INotificationDTO';
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
  ): Promise<{ status: string,patientNotification:INotificationDto | null,doctorNotification:INotificationDto | null }>;

  walletPayment(doctorId:string,date:string,startTime:string,endTime:string,patientId:string,amount:string):
  Promise<{status:string,patientNotification:INotificationDto | null,doctorNotification:INotificationDto | null}>;


}
