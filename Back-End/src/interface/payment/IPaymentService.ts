import { INotification } from '../../models/interface/INotification';

export interface IPaymentService {
  createOrder(amount: number): Promise<any>;
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
}
