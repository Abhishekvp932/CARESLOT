import { Request, Response } from "express";
import { IPatientController } from "../../interface/patients/IPatient.controller";
import { PatientService } from "../../services/patients/patients.service";
import { IPatientService } from "../../interface/patients/IPatient.service";
import { HttpStatus } from "../../utils/httpStatus";
import logger from "../../utils/logger";
export class PatientController implements IPatientController {
  
  constructor(private _patientService: IPatientService) {}
  async getResendAppoinment(req: Request, res: Response): Promise<void> {
    
    try {
      const result = await this._patientService.getResendAppoinments();

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async updateUserProfile(req: Request, res: Response): Promise<void> {
   
    try {
      const { id: userId } = req.params;
       
       
      const formData = req.body;

       

      const imgDate = (req.files as { [key: string]: Express.Multer.File[] })
        ?.profileImage?.[0];
      const profileImg = imgDate?.path;
       
      const result = await this._patientService.updateUserProfile(
        formData,
        userId,
        profileImg
      );

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  }
  async getUserData(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;

      const result = await this._patientService.getUserData(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const search = req.query.search as string;
      const specialty = req.query.specialty as string;
      const result = await this._patientService.getAllDoctors(page,limit,search,specialty);
      res.status(HttpStatus.OK).json({data:result.doctors,currentPage:page,totalPages:Math.ceil(result.total/limit),totalItem:result.total,specializations:result.specializations});
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async getDoctorDetails(req: Request, res: Response): Promise<void> {
    
    try {
      
      const { id: doctorId } = req.params;
      const result = await this._patientService.getDoctorDetails(doctorId);
      res.status(HttpStatus.OK).json({doctor:result});
       
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async getDoctorSlots(req: Request, res: Response): Promise<void> {
    try {
      const {id:doctorId} = req.params
      const result = await this._patientService.getDoctorSlots(doctorId);
      console.log('result',result);
      res.status(HttpStatus.OK).json({slots:result});
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.BAD_REQUEST).json({msg:err.message})
    }
  }
  async getAllspecializations(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._patientService.getAllspecializations();
      logger.debug(result);
      res.status(HttpStatus.OK).json({specializations:result.specializations});
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
    }
  }
  async getDoctorAndSlot(req: Request, res: Response): Promise<void> {
     try {

      logger.info('request comming');
      const {id:doctorId} = req.params;
      const slotId = req.query.slotId as string
      
      const result = await this._patientService.getDoctorAndSlot(doctorId,slotId);
      res.status(HttpStatus.OK).json({slot:result.slot,doctor:result.doctor});
     } catch (error) {
      const err = error as Error
      res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
     }
  }
  async getRelatedDoctor(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.query.doctorId as string
      const specialization = req.query.specialization as string
      const result = await this._patientService.getRelatedDoctor(doctorId,specialization);
      res.status(HttpStatus.OK).json({relatedDoctor:result});
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
    }
  }
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const {id:patientId} = req.params
      const {oldPassword,newPassword} = req.body

      const result = await this._patientService.changePassword(patientId,oldPassword,newPassword);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
    }
  }
}
