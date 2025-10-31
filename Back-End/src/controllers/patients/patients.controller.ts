import { Request, Response, NextFunction } from 'express';
import { IPatientController } from '../../interface/patients/IPatientController';
import { IPatientService } from '../../interface/patients/IPatientService';
import { HttpStatus } from '../../utils/httpStatus';
import logger from '../../utils/logger';
export class PatientController implements IPatientController {
  constructor(private _patientService: IPatientService) {}


  /**
   * @remarks
   * Handles a GET request to get resend appointment requests.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing resend appointment requests.
   */

  async getResendAppoinment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;
      const result = await this._patientService.getResendAppoinments(patientId);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a PUT request to update user profile.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message upon successful update of user profile.
   */

  async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {patientId} = req.params;

      const formData = req.body;

      const imgDate = (req.files as { [key: string]: Express.Multer.File[] })
        ?.profileImage?.[0];
      const profileImg = imgDate?.path;

      const result = await this._patientService.updateUserProfile(
        formData,
        patientId,
        profileImg
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }


/**
 * @remarks
 * Handles a GET request to retrieve user data.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns JSON response containing user data.
 */

  async getUserData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;

      const result = await this._patientService.getUserData(patientId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }


  /**
   * @remarks
   * Handles a GET request to retrieve all doctors.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing all doctors.
   */

  async getAllDoctors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const search = req.query.search as string;
      const specialty = req.query.specialty as string;
      const sortBy = req.query.sortBy as string;
      const result = await this._patientService.getAllDoctors(
        page,
        limit,
        search,
        specialty,
        sortBy
      );
      res.status(HttpStatus.OK).json({
        data: result.doctors,
        currentPage: page,
        totalPages: Math.ceil(result.total / limit),
        totalItem: result.total,
        specializations: result.specializations,
      });
    } catch (error) {
      next(error as Error);
    }
  }


  /**
   * @remarks
   * Handles a GET request to retrieve doctor details.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing doctor details.
   */

  async getDoctorDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { doctorId } = req.params;
      const result = await this._patientService.getDoctorDetails(doctorId);
      res.status(HttpStatus.OK).json({ doctor: result });
    } catch (error) {
      next(error as Error);
    }
  }

/**
 * @remarks
 * Handles a GET request to retrieve available slots for a doctor.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 * @returns JSON response containing available slots for the doctor.
 */

  async getDoctorSlots(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { doctorId } = req.params;
      const date = req.query.date as string;
      logger.debug('date is comming', date);
      const result = await this._patientService.getDoctorSlots(doctorId, date);

      res.status(HttpStatus.OK).json({ slots: result });
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve all specializations.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing all specializations.
   */

  async getAllspecializations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._patientService.getAllspecializations();
      logger.debug(result);
      res
        .status(HttpStatus.OK)
        .json({ specializations: result.specializations });
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve doctor and slot information.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing doctor and slot information.
   */

  async getDoctorAndSlot(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('request comming');
      const {  doctorId } = req.params;

      const result = await this._patientService.getDoctorAndSlot(doctorId);
      res.status(HttpStatus.OK).json({ doctor: result.doctor });
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve related doctors.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing related doctors.
   */

  async getRelatedDoctor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const doctorId = req.query.doctorId as string;
      const specialization = req.query.specialization as string;
      const result = await this._patientService.getRelatedDoctor(
        doctorId,
        specialization
      );
      res.status(HttpStatus.OK).json({ relatedDoctor: result });
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a POST request to change the patient's password.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;
      const { oldPassword, newPassword } = req.body;

      const result = await this._patientService.changePassword(
        patientId,
        oldPassword,
        newPassword
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
 


  /**
   * @remarks
   * Handles a GET request to retrieve all appointments for a patient.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing all appointments for the patient.
   */

  async getAllAppoinments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('patient appoinment request is comming');
      const { patientId } = req.params;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const result = await this._patientService.getAllAppoinments(
        patientId,
        page,
        limit
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
}
