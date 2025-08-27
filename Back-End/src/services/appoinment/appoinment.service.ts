
import { IAppoinmentService } from '../../interface/appoinment/IAppoinmentService';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import { appoinemntData } from '../../types/appoinmentData';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import { IpatientRepository } from '../../interface/auth/auth.interface';
import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import { Types } from 'mongoose';
import { MailService } from '../mail.service';
export class AppoinmentService implements IAppoinmentService {
    constructor(private _appoinmentRepo : IAppoinmentRepository,private _patientRepo:IpatientRepository,private _doctorRepo:IDoctorAuthRepository){}
  

    async createAppoinment(data: appoinemntData): Promise<{ msg: string; }> {
        const doctorId = data?.doctorId;
        const patientId = data?.patientId;
        if(!doctorId || !patientId){
            throw new Error('doctor id or patient id not found');
        }
        const doctor = await this._doctorRepo.findById(doctorId);

        if(!doctor){
            throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
        }
        const patient = await this._patientRepo.findById(patientId);

        if(!patient){
            throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
        }

        const fees = String(data?.amount);
        const newAppoinment = {
            doctorId:new Types.ObjectId(doctor?._id as string),
            patientId:new Types.ObjectId(patient?._id as string),
            slot:{
                date:data?.date,
                startTime:data?.startTime,
                endTime:data?.endTime,
            },
            amount:fees
        };
        console.log('new appoinment',newAppoinment);
        await this._appoinmentRepo.create(newAppoinment);
       const response = {msg:'Appoinmnet booked success'};

        (async ()=>{

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
                
            } catch (error:any) {
                throw new Error(error);
            }
        })();

       return response;
    }
} 