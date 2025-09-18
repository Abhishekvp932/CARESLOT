import IDoctorController from '../../interface/doctor/doctor.controller';
import { HttpStatus } from '../../utils/httpStatus';

import { Request, Response } from 'express';
import { QualificationInput } from '../../interface/doctor/doctor.service.interface';
import { IDoctor } from '../../interface/doctor/doctor.service.interface';

import logger from '../../utils/logger';
export class DoctorController implements IDoctorController {
  constructor(private _doctorService: IDoctor) {}

  async uploadDocuments(req: Request, res: Response): Promise<void> {
    try {
      const files = req.files as {
        educationCertificate?: Express.Multer.File[];
        experienceCertificate?: Express.Multer.File[];
        profileImage?: Express.Multer.File[];
      };

      const { id: doctorId } = req.params;

      const {
        degree,
        institution,
        experience,
        specialization,
        medicalSchool,
        graduationYear,
        about,
        fees,
        lisence,
      } = req.body;

      const input: QualificationInput = {
        degree,
        institution,
        experince: Number(experience),
        specialization,
        medicalSchool,
        graduationYear: Number(graduationYear),
        about,
        lisence: lisence,
        fees,
        educationCertificate: files.educationCertificate?.[0]?.path || '',
        experienceCertificate: files.experienceCertificate?.[0]?.path || '',
      };
      const profileImage = files.profileImage?.[0]?.path || '';
      const result = await this._doctorService.uploadDocument(
        doctorId,
        input,
        profileImage
      );
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ msg: 'qualification error msg' });
    }
  }
  async getDoctorProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id: doctorId } = req.params;

      const result = await this._doctorService.getDoctorProfile(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }

  async editDoctorProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id: doctorId } = req.params;

      const files = req.files as {
        profileImage?: Express.Multer.File[];
        educationCertificate?: Express.Multer.File[];
        experienceCertificate?: Express.Multer.File[];
      };

      const result = await this._doctorService.editDoctorProfile(
        doctorId,
        req.body,
        files
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async reApplyDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params;

      const files = req.files as {
        profileImage?: Express.Multer.File[];
        educationCertificate?: Express.Multer.File[];
        experienceCertificate?: Express.Multer.File[];
      };
      const result = await this._doctorService.reApplyDoctor(
        doctorId,
        req.body,
        files
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }

  async getAllAppoinments(req: Request, res: Response): Promise<void> {
    try {
      logger.info('appoinment request is comming');
      const { doctorId } = req.params;
      const page = parseInt(req.query.pagge as string);
      const limit = parseInt(req.query.limit as string);
      const result = await this._doctorService.getAllAppoinments(doctorId,page,limit);
      res.status(HttpStatus.OK).json({data:result.appoinments,currentPage:page,totalPages: Math.ceil(result.total / limit),totalItem: result.total});
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
}
