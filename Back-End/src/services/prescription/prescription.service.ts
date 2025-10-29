import { IPrescriptionService } from '../../interface/prescription/IPrescriptionService';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import { IDoctorAuthRepository } from '../../interface/doctor/IDoctorRepository';
import { IpatientRepository } from '../../interface/auth/IAuthInterface';
import { IPrecriptionRepository } from '../../interface/prescription/IPrescriptionRepository';
import { Types } from 'mongoose';
import logger from '../../utils/logger';
import { generatePrescriptionPDF } from '../../utils/genaratePDF';

export class PrescriptionService implements IPrescriptionService {
  constructor(
    private _doctorRepository: IDoctorAuthRepository,
    private _appoinmentRepository: IAppoinmentRepository,
    private _patientRepository: IpatientRepository,
    private _prescriptionRepository:IPrecriptionRepository,
  ) {}
  async addPrescription(
    diagnosis: string,
    medicines: string,
    advice: string,
    appoinmentId: string,
    patientId: string,
    doctorId: string
  ): Promise<{ msg: string }> {
  

    const appoinment = await this._appoinmentRepository.findById(appoinmentId);

    if(!appoinment){
      throw new Error('Appoinment Not Found');
    }
    const doctor = await this._doctorRepository.findById(doctorId);
    if(!doctor){
      throw new Error('Doctor Not Found');
    }
    const patient = await this._patientRepository.findById(patientId);

    if(!patient){
      throw new Error('Patient Not Found');
    }
    const newPrescriptionData = {
      diagnosis:diagnosis,
      medicines:medicines,
      advice:advice,
      appoinmentId:new Types.ObjectId(appoinment?._id as string),
      doctorId:new Types.ObjectId(doctor?._id as string),
      patientId:new Types.ObjectId(patient?._id as string),
    };
    await this._prescriptionRepository.create(newPrescriptionData);
    return { msg: 'prescription adedd success' };
  }
  async downloadPrescription(appoinmentId: string): Promise<Buffer> {
    const appoinment = await this._appoinmentRepository.findById(appoinmentId);
    if(!appoinment){
      throw new Error('Appointment Not Found');
    }
    const prescriptonData = await this._prescriptionRepository.findByAppoinmentId(appoinmentId);
    if(!prescriptonData){
      throw new Error('Doctor Not updated Prescription Please wait');
    }
    logger.info('prescription data');
    logger.debug(prescriptonData);
    const pdfBuffer = await generatePrescriptionPDF(prescriptonData);
    logger.debug(pdfBuffer);
    return pdfBuffer;
  }
}
