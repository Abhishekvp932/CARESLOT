import { Request, Response } from "express";
import { IPatientController } from "../../interface/patients/IPatient.controller";
import { PatientService } from "../../services/patients/patients.service";
import { IPatientService } from "../../interface/patients/IPatient.service";
import { HttpStatus } from "../../utils/httpStatus";
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
      
      const result = await this._patientService.getAllDoctors();
 
      res.status(HttpStatus.OK).json({ doctors: result });
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
}
