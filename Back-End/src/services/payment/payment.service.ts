import { IPaymentService } from '../../interface/payment/IPaymentService';
import { IPaymentRepository } from '../../interface/payment/IPaymentRepository';
import { razorpay } from '../../config/razorpayClient';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import { INotificationRepository } from '../../interface/notification/INotificationRepository';
import { IDoctorAuthRepository } from '../../interface/doctor/IDoctorRepository';
import { IpatientRepository } from '../../interface/auth/IAuthInterface';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { Types } from 'mongoose';
import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import { io } from '../../server';
import { MailService } from '../mail.service';
import { IWalletHistoryRepository } from '../../interface/walletHistory/IWalletHistoryRepository';
import { IWalletRepository } from '../../interface/wallet/IWalletRepository';

import { IWallet } from '../../models/interface/IWallet';
import { IWalletHistory } from '../../models/interface/IWallet.history';

import { RazorpayOrder } from '../../utils/RazorpayOrder';
import { IChatRepository } from '../../interface/chat/IChatRepository';
import { IChat } from '../../models/interface/IChat';
import logger from '../../utils/logger';
import { IAppoinment } from '../../models/interface/IAppoinments';
import { IChatPopulated } from '../../types/ChatAndDoctorPopulatedDTO';
import { ICallLogRepository } from '../../interface/callLogs/ICallLogRepository';
import { ICallLog } from '../../models/interface/ICallLog';
import { INotificationDto } from '../../types/INotificationDTO';
dotenv.config();

export class PaymentService implements IPaymentService {
  constructor(
    private _paymentRepository: IPaymentRepository,
    private _appoinmentRepository: IAppoinmentRepository,
    private _notificationRepository: INotificationRepository,
    private _doctorRepository: IDoctorAuthRepository,
    private _patientRepository: IpatientRepository,
    private _walletRepository: IWalletRepository,
    private _walletHistoryRepository: IWalletHistoryRepository,
    private _chatRepository: IChatRepository,
    private _callLogRepository: ICallLogRepository
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
    patientNotification: INotificationDto | null;
    doctorNotification: INotificationDto | null;
  }> {
    const doctor = await this._doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

    const patient = await this._patientRepository.findById(patientId);

    if (!patient) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    const appoinmentExists = await this._appoinmentRepository.findByOneSlot(
      doctorId,
      date,
      startTime
    );

    if (appoinmentExists) {
      throw new Error('Appointment already booked');
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
      logger.info('22');
      const scheduledStart = new Date(
        `${appoinment.slot.date}T${appoinment.slot.startTime}`
      );
      const scheduledEnd = new Date(
        `${appoinment.slot.date}T${appoinment.slot.endTime}`
      );

      const newCallLogs: Partial<ICallLog> = {
        doctorId: new Types.ObjectId(appoinment?.doctorId),
        patientId: new Types.ObjectId(appoinment?.patientId),
        appoinmentId: new Types.ObjectId(appoinment?._id as string),
        startTime: scheduledStart,
        endTime: scheduledEnd,
        duration: Math.floor(
          (scheduledEnd.getTime() - scheduledStart.getTime()) / 1000
        ),
        status: 'scheduled',
      };
      await this._callLogRepository.create(newCallLogs);
      const userChat = await this._chatRepository.findPatientChat(
        patient?._id as string
      );
      logger.info('user chat');
      logger.debug(userChat);

      const exists = userChat.some(
        (c: IChatPopulated) =>
          c.doctorId._id.toString() === doctorId &&
          c.patiendId.toString() === patientId
      );
      logger.debug(exists);

      if (!exists) {
        const newChat: Partial<IChat> = {
          appoinmentId: appoinment?.id,
          doctorId: appoinment?.doctorId,
          patiendId: appoinment?.patientId,
          participants: [appoinment?.doctorId, appoinment?.patientId],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await this._chatRepository.create(newChat);
      }else{
        await this._chatRepository.findByPatientIdAndUpdate(patientId,doctorId,{isActive:true});
      }

      const doctorWallet = await this._walletRepository.findByUserId(
        doctorId as string
      );

      if (!doctorWallet) {
        const newWallet: Partial<IWallet> = {
          userId: new Types.ObjectId(doctorId as string),
          role: 'doctor',
          balance: Number(amount),
        };

        const wallet = await this._walletRepository.create(newWallet);

        const newWalletHistory: Partial<IWalletHistory> = {
          walletId: new Types.ObjectId(wallet?._id as string),
          appoinmentId: new Types.ObjectId(appoinment?._id as string),
          transactionId: new Types.ObjectId(payment?._id as string),
          amount: Number(amount),
          type: 'credit',
          source: 'consultation',
          status: 'success',
        };
        await this._walletHistoryRepository.create(newWalletHistory);
      } else {
        const newWalletHistory: Partial<IWalletHistory> = {
          walletId: new Types.ObjectId(doctorWallet?._id as string),
          appoinmentId: new Types.ObjectId(appoinment?._id as string),
          transactionId: new Types.ObjectId(payment?._id as string),
          amount: Number(amount),
          type: 'credit',
          source: 'consultation',
          status: 'success',
        };

        await this._walletHistoryRepository.create(newWalletHistory);

        await this._walletRepository.findByIdAndUpdate(
          doctorWallet?._id as string,
          { $inc: { balance: Number(amount) } }
        );
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
         
                             Patient : ${patient?.name},
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

  async walletPayment(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    patientId: string,
    amount: string
  ): Promise<{
    status: string;
    patientNotification: INotificationDto | null;
    doctorNotification: INotificationDto | null;
  }> {
    const fees = Number(amount);
    const doctor = await this._doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor Not found');
    }
    const patient = await this._patientRepository.findById(patientId);

    if (!patient) {
      throw new Error('Patient Not found');
    }
    const wallet = await this._walletRepository.findByUserId(
      patient?._id as string
    );
    if (!wallet) {
      throw new Error('Wallet Not found');
    }

    if (wallet.balance < fees) {
      throw new Error('insufficient balance');
    }
    const newAppoinment: Partial<IAppoinment> = {
      doctorId: new Types.ObjectId(doctor?._id as string),
      patientId: new Types.ObjectId(patient?._id as string),
      slot: {
        date: date,
        startTime: startTime,
        endTime: endTime,
      },
      amount: amount,
    };

    const appoinment = await this._appoinmentRepository.create(newAppoinment);

    await this._walletRepository.findByIdAndUpdate(wallet?._id as string, {
      $inc: { balance: -fees },
    });

    const newWalletHistory: Partial<IWalletHistory> = {
      walletId: new Types.ObjectId(wallet?._id as string),
      appoinmentId: new Types.ObjectId(appoinment?._id as string),
      amount: Number(amount),
      type: 'debit',
      source: 'consultation',
      status: 'success',
    };
    await this._walletHistoryRepository.create(newWalletHistory);

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

    const response = {
      status: 'success',
      patientNotification: patientNotif,
      doctorNotification: doctorNotif,
    };

    const userChat = await this._chatRepository.findPatientChat(
      patient?._id as string
    );
    const exists = userChat.some(
      (c: IChatPopulated) =>
        c.doctorId._id.toString() === doctorId &&
        c.patiendId.toString() === patientId
    );

    if (!exists) {
      const newChat: Partial<IChat> = {
        appoinmentId: new Types.ObjectId(appoinment?._id as string),
        doctorId: new Types.ObjectId(appoinment?.doctorId),
        patiendId: new Types.ObjectId(appoinment?.patientId),
        participants: [
          new Types.ObjectId(appoinment?.doctorId),
          new Types.ObjectId(appoinment?.patientId),
        ],
      };

      await this._chatRepository.create(newChat);
    }else {
      await this._chatRepository.findByPatientIdAndUpdate(patientId,doctorId,{isActive:true});
    }

    const doctorWallet = await this._walletRepository.findByUserId(
      doctor?._id as string
    );

    if (!doctorWallet) {
      const newWallet: Partial<IWallet> = {
        userId: new Types.ObjectId(doctorId as string),
        role: 'doctor',
        balance: Number(amount),
      };

      const newDoctorWallet = await this._walletRepository.create(newWallet);

      const newWalletHistory: Partial<IWalletHistory> = {
        walletId: new Types.ObjectId(newDoctorWallet?._id as string),
        appoinmentId: new Types.ObjectId(appoinment?._id as string),
        amount: Number(amount),
        type: 'credit',
        source: 'consultation',
        status: 'success',
      };
      await this._walletHistoryRepository.create(newWalletHistory);
    } else {
      const newWalletHistory: Partial<IWalletHistory> = {
        walletId: new Types.ObjectId(doctorWallet?._id as string),
        appoinmentId: new Types.ObjectId(appoinment?._id as string),
        amount: Number(amount),
        type: 'credit',
        source: 'consultation',
        status: 'success',
      };

      await this._walletHistoryRepository.create(newWalletHistory);

      await this._walletRepository.findByIdAndUpdate(
        doctorWallet?._id as string,
        { $inc: { balance: Number(amount) } }
      );
    }

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

    return response;
  }
}
