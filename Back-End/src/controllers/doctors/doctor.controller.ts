import IDoctorController from '../../interface/doctor/IDoctorController';
import { HttpStatus } from '../../utils/httpStatus';

import { Request, Response, NextFunction } from 'express';
import { QualificationInput } from '../../interface/doctor/IDoctorService';
import { IDoctorService } from '../../interface/doctor/IDoctorService';

import logger from '../../utils/logger';
export class DoctorController implements IDoctorController {
  constructor(private _doctorService: IDoctorService) {}



  /**
   * @remarks
   * Handles a POST request to upload documents.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful upload of documents.
   */

  async uploadDocuments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const files = req.files as {
        educationCertificate?: Express.Multer.File[];
        experienceCertificate?: Express.Multer.File[];
        profileImage?: Express.Multer.File[];
      };

      const { doctorId } = req.params;

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
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to get doctor profile.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing doctor profile.
   */

  async getDoctorProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: doctorId } = req.params;

      const result = await this._doctorService.getDoctorProfile(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a PUT request to edit doctor profile.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful edit of doctor profile.
   */

  async editDoctorProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error as Error);
    }
  }

  
  /**
   * @remarks
   * Handles a POST request to re-apply for doctor.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful re-application of doctor.
   */

  async reApplyDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to get all appointments for a doctor.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing all appointments for the doctor.
   */

  async getAllAppoinments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('appoinment request is comming');
      const { doctorId } = req.params;
      const page = parseInt(req.query.pagge as string);
      const limit = parseInt(req.query.limit as string);
      const status = req.query.status as string;
      logger.debug(status);
      const result = await this._doctorService.getAllAppoinments(
        doctorId,
        page,
        limit,
        status
      );
      res.status(HttpStatus.OK).json({
        data: result.appoinments,
        currentPage: page,
        totalPages: Math.ceil(result.total / limit),
        totalItem: result.total,
      });
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to get doctor dashboard data.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing doctor dashboard data.
   */

  async getDoctorDashboardData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('doctor dashboard request is comming ...');
      const {doctorId} = req.params;
      const filter = req.query.filter as string;
      const result = await this._doctorService.getDoctorDashboardData(doctorId,filter);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
