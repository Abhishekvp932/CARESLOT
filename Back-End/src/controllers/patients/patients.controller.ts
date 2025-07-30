import { Request, Response } from "express";
import { IPatientController } from "../../interface/patients/IPatient.controller";
import { PatientService } from "../../services/patients/patients.service";
import { IPatientService } from "../../interface/patients/IPatient.service";
import { HttpStatus } from "../../utils/httpStatus";
export class PatientController implements IPatientController {
  constructor(private patientService: IPatientService) {}
  async getResendAppoinment(req: Request, res: Response): Promise<void> {
    
    try {
      const result = await this.patientService.getResendAppoinments();

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async updateUserProfile(req: Request, res: Response): Promise<void> {
   
    try {
      const { id: userId } = req.params;
      console.log("updating user id is", userId);
      console.log("user profile is", req.body);
      const formData = req.body;

      console.log("file details", req.files);

      const imgDate = (req.files as { [key: string]: Express.Multer.File[] })
        ?.profileImage?.[0];
      const profileImg = imgDate?.path;
      console.log("imge path", profileImg);
      const result = await this.patientService.updateUserProfile(
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

      const result = await this.patientService.getUserData(userId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      // console.log('request is comming');
      const result = await this.patientService.getAllDoctors();
      // console.log('result',result);
      res.status(HttpStatus.OK).json({ doctors: result });
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async getDoctorDetails(req: Request, res: Response): Promise<void> {
     console.log('ijnvijnvjn')
    try {
      
      const { id: doctorId } = req.params;
      const result = await this.patientService.getDoctorDetails(doctorId);
      res.status(HttpStatus.OK).json({doctor:result});
      console.log(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
}
