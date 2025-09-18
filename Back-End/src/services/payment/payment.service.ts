import { IPaymentService } from '../../interface/payment/IPaymentService';
import { IPaymentRepository } from '../../interface/payment/IPaymentRepository';
import { razorpay } from '../../config/razorpayClient';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import { INotificationRepository } from '../../interface/notification/INotificationRepository';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import { IpatientRepository } from '../../interface/auth/auth.interface';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Types } from 'mongoose';
import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import { io } from '../../server';
import { MailService } from '../mail.service';
import { IWalletHistoryRepository } from '../../interface/walletHistory/IWalletHistoryRepository';
import { IWalletRepository } from '../../interface/wallet/IWalletRepository';
import { INotification } from '../../models/interface/INotification';
import { IWallet } from '../../models/interface/IWallet';
import { IWalletHistory } from '../../models/interface/IWallet.history';

import { RazorpayOrder } from '../../utils/RazorpayOrder';
import { IChatRepository } from '../../interface/chat/IChatRepository';
import { IChat } from '../../models/interface/IChat';
import logger from '../../utils/logger';
dotenv.config();

export class PaymentService implements IPaymentService {
  constructor(
    private _paymentRepository: IPaymentRepository,
    private _appoinmentRepository: IAppoinmentRepository,
    private _notificationRepository: INotificationRepository,
    private _doctorRepository: IDoctorAuthRepository,
    private _patientRepository: IpatientRepository,
    private _walletRepository:IWalletRepository,
    private _walletHistoryRepository:IWalletHistoryRepository,
    private _chatRepository:IChatRepository,
  ) {}

  async createOrder(amount: number): Promise<RazorpayOrder> {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: 'order_rcptid_' + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    console.log(order);
    return order as RazorpayOrder;
  }
  async verifyOrder(
    orderId: string,
    paymentId: string,
    signature: string,
    doctorId: string,
    patientId: string,
    date: string,
    startTime: string,
    endTime: string,
    amount: string,
    paymentMethod: string
  ): Promise<{
    status: string;
    patientNotification: INotification | null;
    doctorNotification: INotification | null;
  }> {
    const doctor = await this._doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

    const patient = await this._patientRepository.findById(patientId);

    if (!patient) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const body = orderId + '|' + paymentId;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET as string)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === signature;
    let response = null;
    if (isValid) {
      const newAppoinment = {
        doctorId: new Types.ObjectId(doctorId as string),
        patientId: new Types.ObjectId(patientId as string),
        slot: {
          date: date,
          startTime: startTime,
          endTime: endTime,
        },
        amount: amount,
      };

      const appoinment = await this._appoinmentRepository.create(newAppoinment);
      if (!appoinment) {
        throw new Error('appoinment not found');
      }

      const newPayment = {
        appoinmentId: new Types.ObjectId(appoinment?._id as string),
        patientId: new Types.ObjectId(patientId as string),
        doctorId: new Types.ObjectId(doctorId as string),
        amount: Number(amount),
        currency: 'INR',
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        paymentMethod: paymentMethod,
      };
      const payment = await this._paymentRepository.create(newPayment);
      await this._appoinmentRepository.findByIdAndUpdate(
        appoinment?._id as string,
        { transactionId: new Types.ObjectId(payment?._id as string) }
      );


      const newChat:Partial<IChat> = {
        appoinmentId:appoinment?.id,
        doctorId:appoinment?.doctorId,
        patiendId:appoinment?.patientId,
        participants:[appoinment?.doctorId,appoinment?.patientId],
        isActive:true,
        createdAt:new Date(),
        updatedAt:new Date(),

      };
      await this._chatRepository.create(newChat);
      const doctorWallet = await this._walletRepository.findByUserId(doctorId as string);

      if(!doctorWallet){
        
        const newWallet:Partial<IWallet> = {
          userId:new Types.ObjectId(doctorId as string),
          role:'doctor',
          balance:Number(amount),
        };
         
       
       const wallet =  await this._walletRepository.create(newWallet);
        
        const newWalletHistory:Partial<IWalletHistory> = {
          walletId:new Types.ObjectId(wallet?._id as string),
          appoinmentId:new Types.ObjectId(appoinment?._id as string),
          transactionId:new Types.ObjectId(payment?._id as string),
          amount:Number(amount),
          type:'credit',
          source:'consultation',
          status:'success',
        };
        await this._walletHistoryRepository.create(newWalletHistory);

   

      } 
      else{

        const newWalletHistory:Partial<IWalletHistory> = {
         walletId:new Types.ObjectId(doctorWallet?._id as string),
         appoinmentId:new Types.ObjectId(appoinment?._id as string),
         transactionId:new Types.ObjectId(payment?._id as string),
         amount:Number(amount),
         type:'credit',
        source:'consultation',
        status:'success',
       }; 

       await this._walletHistoryRepository.create(newWalletHistory);
        
         await this._walletRepository.findByIdAndUpdate(doctorWallet?._id as string,{$inc:{balance:Number(amount)}});

       
      }
         

      const patientNotif = await this._notificationRepository.create({
        userId: patientId,
        title: 'Appoinment Booked',
        message: `Your appointment with doctor ${doctor?.name} is booked at ${date} - ${startTime}`,
        isRead: false,
      });

      io.to(patientId).emit('notification', patientNotif);

      const doctorNotif = await this._notificationRepository.create({
        userId: doctorId,
        title: 'New Appoinment Booked',
        message: `New Appoinment Booked Patient Name ${patient?.name} time slot ${date} ${startTime}`,
        isRead: false,
      });
      io.to(doctorId).emit('notification', doctorNotif);

      // response = {
      // status: isValid ? 'success' : 'failed',
      // patientNotification: patientNotif,
      // doctorNotification: doctorNotif
      // };

      (async () => {
        const mailService = new MailService();
        try {
          mailService.sendMail(
            patient?.email,
            'Appointment Confirmation - CareSlot',
            `Hello ${patient?.name},
                             Your appointment has been successfully booked.
         
                             Doctor : Dr.${doctor?.name},
                             Date:${date},
                             Time:${startTime} - ${endTime},
                             status : Pending Confirmation,
         
                             Thank you for choosing CareSlot.  
                              We look forward to seeing you.  
         
                              Best regards,  
                              CareSlot Team
                             
                             `
          );

          mailService.sendMail(
            doctor?.email,
            'New Appointment Booked - CareSlot',
            `Hello ${doctor?.name},
                             A new appointment has been booked.
         
                             Patient : Dr.${patient?.name},
                             Date:${date},
                             Time:${startTime} - ${endTime},
                             status : Pending Confirmation,
                            Please review and confirm the appointment in your dashboard.
         
                              Best regards,  
                              CareSlot Team
                             
                             `
          );
        } catch (error: unknown) {
  if (error instanceof Error) {
    logger.error(error.message);
    throw new Error(error.message);
  } else {
    logger.error('Unknown error', error);
    throw new Error('Something went wrong');
  }
}
      })();
      response = {
        status: 'success',
        patientNotification: patientNotif,
        doctorNotification: doctorNotif,
      };
    } else {
      response = {
        status: 'failed',
        patientNotification: null,
        doctorNotification: null,
      };
    }
    return response;
  }
}
