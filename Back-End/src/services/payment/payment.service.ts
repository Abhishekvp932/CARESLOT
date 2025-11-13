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
import mongoose from 'mongoose';
import { acquireLock, releaseLock } from '../../utils/redisLock';
dotenv.config();
const mailService = new MailService();
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
    const session = await mongoose.startSession();
    session.startTransaction();
    const slotKey = `lock:slot:${doctorId}:${date}:${startTime}`;
    const ttl = 5000;
    try {
      const getLock = await acquireLock(slotKey, ttl);

      if (!getLock) {
        throw new Error('Slot already booked. Please choose another slot.');
      }

      const doctor = await this._doctorRepository.findById(doctorId);
      if (!doctor) throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);

      const patient = await this._patientRepository.findById(patientId);
      if (!patient) throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);

      const appoinmentExists = await this._appoinmentRepository.findByOneSlot(
        doctorId,
        date,
        startTime,
        session
      );
      if (appoinmentExists) throw new Error('Appointment already booked');

      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET as string)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === signature;
      let response = null;

      if (!isValid) {
        return {
          status: 'failed',
          patientNotification: null,
          doctorNotification: null,
        };
      }

      const newAppoinment = {
        doctorId: new Types.ObjectId(doctorId as string),
        patientId: new Types.ObjectId(patientId as string),
        slot: { date, startTime, endTime },
        amount,
      };
      const appoinment = await this._appoinmentRepository.create(
        newAppoinment,
        session
      );
      if (!appoinment) throw new Error('appoinment not found');

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
      const payment = await this._paymentRepository.create(newPayment,session);
      logger.info('Payment created:');
      logger.debug(payment);
      await this._appoinmentRepository.findByIdAndUpdate(
        appoinment?._id as string,
        { transactionId: new Types.ObjectId(payment?._id as string) },
        session
      );

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
      logger.info('Creating call log:');
      logger.debug(newCallLogs);
      
      await this._callLogRepository.create(newCallLogs,session);

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
          appoinmentId: appoinment?.id,
          doctorId: appoinment?.doctorId,
          patiendId: appoinment?.patientId,
          participants: [appoinment?.doctorId, appoinment?.patientId],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await this._chatRepository.create(newChat,session);
      } else {
        await this._chatRepository.findByPatientIdAndUpdate(
          patientId,
          doctorId,
          { isActive: true },
          session
        );
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
        const wallet = await this._walletRepository.create(newWallet,session);

        const newWalletHistory: Partial<IWalletHistory> = {
          walletId: new Types.ObjectId(wallet?._id as string),
          appoinmentId: new Types.ObjectId(appoinment?._id as string),
          transactionId: new Types.ObjectId(payment?._id as string),
          amount: Number(amount),
          type: 'credit',
          source: 'consultation',
          status: 'success',
        };
        await this._walletHistoryRepository.create(newWalletHistory,session);
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
        await this._walletHistoryRepository.create(newWalletHistory,session);

        await this._walletRepository.findByIdAndUpdate(
          doctorWallet?._id as string,
          {
            $inc: { balance: Number(amount) },
          },
          session
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
        try {
          await mailService.sendPatientAppoinmentEmail(
            patient?.email,
            patient?.name,
            date,
            startTime,
            endTime,
            doctor?.name
          );
          await mailService.sendDoctorAppoinmentEmail(
            doctor?.email,
            doctor?.name,
            patient?.name,
            date,
            startTime,
            endTime
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
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      await releaseLock(slotKey);
    }
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
    const session = await mongoose.startSession();
    session.startTransaction();
    const slotKey = `lock:slot:${doctorId}:${date}:${startTime}`;
    const ttl = 5000;
    try {
      const getLock = await acquireLock(slotKey, ttl);

      if (!getLock) {
        throw new Error('Slot already booked. Please choose another slot.');
      }

      const fees = Number(amount);
      const doctor = await this._doctorRepository.findById(doctorId);
      if (!doctor) {
        throw new Error('Doctor Not found');
      }
      const patient = await this._patientRepository.findById(patientId);

      if (!patient) {
        throw new Error('Patient Not found');
      }


      const appoinmentExists = await this._appoinmentRepository.findByOneSlot(
      doctorId,
      date,
      startTime,
      session
      );
      if (appoinmentExists) throw new Error('Appointment already booked');


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

      const appoinment = await this._appoinmentRepository.create(
        newAppoinment,
        session
      );

      await this._walletRepository.findByIdAndUpdate(wallet?._id as string, {
        $inc: { balance: -fees },
      },session);

      const newWalletHistory: Partial<IWalletHistory> = {
        walletId: new Types.ObjectId(wallet?._id as string),
        appoinmentId: new Types.ObjectId(appoinment?._id as string),
        amount: Number(amount),
        type: 'debit',
        source: 'consultation',
        status: 'success',
      };
      await this._walletHistoryRepository.create(newWalletHistory,session);

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

        await this._chatRepository.create(newChat,session);
      } else {
        await this._chatRepository.findByPatientIdAndUpdate(
          patientId,
          doctorId,
          {
            isActive: true,
          },
          session
        );
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
        await this._walletHistoryRepository.create(newWalletHistory,session);
      } else {
        const newWalletHistory: Partial<IWalletHistory> = {
          walletId: new Types.ObjectId(doctorWallet?._id as string),
          appoinmentId: new Types.ObjectId(appoinment?._id as string),
          amount: Number(amount),
          type: 'credit',
          source: 'consultation',
          status: 'success',
        };

        await this._walletHistoryRepository.create(newWalletHistory,session);

        await this._walletRepository.findByIdAndUpdate(
          doctorWallet?._id as string,
          { $inc: { balance: Number(amount) } },
          session
        );
      }

      (async () => {
        try {
          await mailService.sendPatientAppoinmentEmail(
            patient?.email,
            patient?.name,
            date,
            startTime,
            endTime,
            doctor?.name
          );
          await mailService.sendDoctorAppoinmentEmail(
            doctor?.email,
            doctor?.name,
            patient?.name,
            date,
            startTime,
            endTime
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
      await session.commitTransaction();
      return response;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      await releaseLock(slotKey);
    }
  }
}
