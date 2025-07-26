import IDoctorController from "../../interface/doctor/doctor.controller";
import { HttpStatus } from "../../utils/httpStatus";
import { CONTROLLER_MESSAGE } from "../../utils/controllerMessage";
import { NextFunction, Request, Response } from "express";
import { DoctorService } from "../../services/doctor/doctor.service";
import { QualificationInput } from "../../interface/doctor/doctor.service.interface";
import { IDoctor } from "../../interface/doctor/doctor.service.interface";
export class DoctorController implements IDoctorController {
  constructor(private doctorService: IDoctor) {}

  async uploadDocuments(req: Request, res: Response): Promise<void> {
    console.log('controller recived')
    try {
      const files = req.files as {
        educationCertificate?: Express.Multer.File[];
        experienceCertificate?: Express.Multer.File[];
        profileImage?:Express.Multer.File[];
      };
      console.log('files',files)
     const { id: doctorId } = req.params;

    
     if(!doctorId){
      res.status(HttpStatus.BAD_REQUEST).json({msg:"Doctor id missing"});
     }

      console.log('doctor id is showing',doctorId);
      const {
        degree,
        institution,
        experience,
        specialization,
        medicalSchool,
        graduationYear,
        about,
        fees,
        lisence
      } = req.body;
    console.log('qualifications',req.body);
      const input : QualificationInput = {
        degree,
        institution,
        experince: Number(experience),
        specialization,
        medicalSchool,
        graduationYear: Number(graduationYear),
        about,
        lisence:lisence,
        fees,
        educationCertificate: files.educationCertificate?.[0]?.path || '',
        experienceCertificate: files.experienceCertificate?.[0]?.path || '',
      }
      const profileImage = files.profileImage?.[0]?.path || ''
      const result = await this.doctorService.uploadDocument(doctorId,input,profileImage);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
        const err = error as Error
        res.status(HttpStatus.BAD_REQUEST).json({msg:'qualification error msg'})
    }
  }
}
