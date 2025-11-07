 import IAdminController from '../../interface/admin/IAdminController';
import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../utils/httpStatus';
import { IAdminService } from '../../interface/admin/IAdminService';
import { IDoctor } from '../../models/interface/IDoctor';
import logger from '../../utils/logger';

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  /**
   * @remarks
   * Handles a GET request to retrieve all patients from the database.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing all patients.
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const search = req.query.search as string;
      const result = await this._adminService.findAllUsers(page, limit, search);

      res.status(HttpStatus.OK).json({
        data: result.users,
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
   * Handles a GET request to retrieve all doctors from the database.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing all doctors.
   */
  async getAllDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const search = req.query.search as string;

      const result = await this._adminService.findAllDoctors(page, limit, search);

      res.status(HttpStatus.OK).json({
        data: result.doctors,
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
   * Handles a PATCH request to block or unblock a patient.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */
  async blockAndUnblockUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { isBlocked } = req.body;
      const result = await this._adminService.blockAndUnblockUsers(userId, isBlocked);

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a PATCH request to block or unblock a doctor.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */
  async blockAndUnblockDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { doctorId } = req.params;
      const { isBlocked, reason } = req.body;

      const result = await this._adminService.blockAndUnblockDoctors(doctorId, isBlocked, reason);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve all unapproved doctors.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing unapproved doctors.
   */
  async findUnprovedDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const search = req.query.search as string;

      const result = await this._adminService.findUnApprovedDoctors(page, limit, search);

      res.status(HttpStatus.OK).json({
        data: result.doctors,
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
   * Handles a PATCH request to approve a pending doctor.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */
  async doctorApprove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { doctorId } = req.params;
      const result = await this._adminService.doctorApprove(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a PATCH request to reject a pending doctor with a reason.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */
  async doctorReject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { doctorId } = req.params;
      const { reason } = req.body;
      logger.debug('Rejection reason:', reason);

      const result = await this._adminService.doctorReject(doctorId, reason);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve details of an unapproved doctor for verification.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing doctor details.
   */
  async getVerificationDoctorDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { doctorId } = req.params;
      const result = await this._adminService.getVerificationDoctorDetails(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a PUT request to update a patient's profile.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */
  async updateUserData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const formData = req.body;

      const imgData = (req.files as { [key: string]: Express.Multer.File[] })?.profileImage?.[0];
      const profileImg = imgData?.path;

      const result = await this._adminService.updateUserData(formData, userId, profileImg);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a PUT request to edit doctor details.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing updated doctor details.
   */
  async editDoctorData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { doctorId } = req.params;
      logger.info('Doctor ID received:', doctorId);

      if (!doctorId) {
        res.status(HttpStatus.BAD_REQUEST).json({ msg: 'Doctor ID not found' });
        return;
      }

      const result = await this._adminService.editDoctorData(doctorId);
      logger.debug(result);
      res.status(HttpStatus.OK).json({ doctor: result });
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a POST request to add a new patient.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */
  async addUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone, gender, dob, password } = req.body;
      const imgData = (req.files as { [key: string]: Express.Multer.File[] })?.profileImage?.[0];
      const profileImg = imgData?.path;

      const result = await this._adminService.addUser(name, email, phone, gender, dob, password, profileImg);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a POST request to add a new doctor.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns A success message.
   */
  async addDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as {
        educationCertificate?: Express.Multer.File[];
        experienceCertificate?: Express.Multer.File[];
        profileImage?: Express.Multer.File[];
      };

      const {
        name,
        email,
        phone,
        DOB,
        gender,
        degree,
        institution,
        specialization,
        medicalSchool,
        experince,
        graduationYear,
        fees,
        license,
        about,
      } = req.body;

      const data: Partial<IDoctor> = {
        name,
        email,
        phone,
        DOB,
        gender,
        profile_img: files.profileImage?.[0]?.path || '',
        isApproved: true,
        qualifications: {
          degree,
          institution,
          specialization,
          medicalSchool,
          experince: Number(experince),
          graduationYear: Number(graduationYear),
          fees,
          lisence: license,
          about,
          educationCertificate: files.educationCertificate?.[0]?.path || '',
          experienceCertificate: files.experienceCertificate?.[0]?.path || '',
        },
      };

      const result = await this._adminService.addDoctor(data);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve all appointments.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing appointments.
   */
  async getAllAppoinments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Admin appointment fetch request received');
      const status = req.query.status as string;
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const result = await this._adminService.getAllAppoinments(status,page,limit);
      res.status(HttpStatus.OK).json({data:result.appoinments,currentPage:page,totalPages: Math.ceil(result.total / limit), totalItem: result.total});
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve doctor slots and related appointments.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing doctor slots and appointments.
   */
  async getDoctorSlotAndAppoinment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { doctorId } = req.params;
      logger.info('Doctor slot and appointment fetch request received');
      const result = await this._adminService.getDoctorSlotAndAppoinment(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }

  /**
   * @remarks
   * Handles a GET request to retrieve data for the admin dashboard.
   *
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns JSON response containing dashboard statistics.
   */
  async getAdminDashboardData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Admin dashboard data fetch request received...');
      const filter = req.query.filter as string;
      logger.info(filter);
      const result = await this._adminService.getAdminDashboardData(filter);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      next(error as Error);
    }
  }
}
