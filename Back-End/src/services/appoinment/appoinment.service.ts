import { IAppoinmentService } from '../../interface/appoinment/IAppoinmentService';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import { appoinemntData } from '../../types/appoinmentData';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import { IpatientRepository } from '../../interface/auth/auth.interface';
import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import {Types } from 'mongoose';
import { MailService } from '../mail.service';
import { INotificationRepository } from '../../interface/notification/INotificationRepository';
import { io } from '../../server';
import { INotification } from '../../models/interface/INotification';

import { IWalletRepository } from '../../interface/wallet/IWalletRepository';
import { IWalletHistoryRepository } from '../../interface/walletHistory/IWalletHistoryRepository';

export class AppoinmentService implements IAppoinmentService {
  constructor(
    private _appoinmentRepository: IAppoinmentRepository,
    private _patientRepository: IpatientRepository,
    private _doctorRepository: IDoctorAuthRepository,
    private _notificationRepository: INotificationRepository,
    private _walletRepository:IWalletRepository,
    private _walletHistoryRepository:IWalletHistoryRepository,
  ) {}

  async createAppoinment(
    data: appoinemntData
  ): Promise<{
    msg: string;
    patientNotification: INotification | null;
    doctorNotification: INotification | null;
  }> {
    const doctorId = data?.doctorId;
    const patientId = data?.patientId;
    if (!doctorId || !patientId) {
      throw new Error('doctor id or patient id not found');
    }
    const doctor = await this._doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const patient = await this._patientRepository.findById(patientId);

    if (!patient) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const fees = String(data?.amount);
    const newAppoinment = {
      doctorId: new Types.ObjectId(doctor?._id as string),
      patientId: new Types.ObjectId(patient?._id as string),
      slot: {
        date: data?.date,
        startTime: data?.startTime,
        endTime: data?.endTime,
      },
      amount: fees,
    };

    await this._appoinmentRepository.create(newAppoinment);
    const notif = await this._notificationRepository.create({
      userId: patientId,
      title: 'Appoinment Booked',
      message: `Your appointment with doctor ${doctor?.name} is booked at ${data?.date} - ${data?.startTime}.`,
      isRead: false,
    });
    io.to(patientId).emit('notification', notif);

    const drNotif = await this._notificationRepository.create({
      userId: doctorId,
      title: 'New Appoinment Booked',
      message: `New Appoinment Booked Patient Name ${patient?.name} time slot ${data?.date} ${data?.startTime}`,
      isRead: false,
    });
    io.to(doctorId).emit('notification', drNotif);

    const response = {
      msg: 'Appoinmnet booked success',
      patientNotification: notif,
      doctorNotification: drNotif,
    };

    (async () => {
      const mailService = new MailService();
      try {
        mailService.sendMail(
          patient?.email,
          'Appointment Confirmation - CareSlot',
          `Hello ${patient?.name},
                    Your appointment has been successfully booked.

                    Doctor : Dr.${doctor?.name},
                    Date:${data?.date},
                    Time:${data?.startTime} - ${data?.endTime},
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
                    Date:${data?.date},
                    Time:${data?.startTime} - ${data?.endTime},
                    status : Pending Confirmation,
                   Please review and confirm the appointment in your dashboard.

                     Best regards,  
                     CareSlot Team
                    
                    `
        );
      } catch (error: any) {
        throw new Error(error);
      }
    })();

    return response;
  }


  async cancelAppoinment(appoinmentId: string):Promise<{msg:string,doctorNotification:INotification | null}>{
    
   const appoinment = await this._appoinmentRepository.findById(appoinmentId);

   if(!appoinment){
    throw new Error('Appoinment not found');
   }


   await this._appoinmentRepository.findByIdAndUpdate(appoinmentId,{status:'cancelled'});


   const patientId = String(appoinment.patientId);
   const patient = await this._patientRepository.findById(patientId); 

   if(!patient){
    throw new Error('Patient not found');
   }

  //  let userWallet = null;
  //  let role = null;

   const userWallet = await this._walletRepository.findByUserId(patientId);
   
    
  //     const payload = {
  //     userId:patientId,
  //     role:'patient',

  //  }


   const doctorId = String(appoinment?.doctorId);
   
   if(!doctorId){
    throw new Error('Doctor id not found');
   }
   const doctorNotification = await this._notificationRepository.create({
    userId:doctorId,
    title:'Appoinment cancelld',
    message:`Your Appoinment Cancelld Patient Name ${patient?.name} time slot ${appoinment?.slot?.date} - ${appoinment?.slot?.startTime}`,
    isRead:false,

   });

   io.to(doctorId).emit('notification',doctorNotification);

    return {msg:'Appoinment cancelled',doctorNotification};
  }
}
