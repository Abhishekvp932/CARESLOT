import IAdminController from '../../interface/admin/admin.controller.interface';
import { Request, Response } from 'express';
import { HttpStatus } from '../../utils/httpStatus';
import { IAdminService } from '../../interface/admin/admin.serivce.interface';
import { IDoctor } from '../../models/interface/IDoctor';
import logger from '../../utils/logger';
export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string);

      const limit = parseInt(req.query.limit as string);
      const search = req.query.search as string;
      const result = await this._adminService.findAllUsers(page, limit, search);
      res
        .status(HttpStatus.OK)
        .json({
          data: result.users,
          currentPage: page,
          totalPages: Math.ceil(result.total / limit),
          totalItem: result.total,
        });
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
      const result = await this._adminService.findAllDoctors(
        page,
        limit,
        search
      );

      res
        .status(HttpStatus.OK)
        .json({
          data: result.doctors,
          currentPage: page,
          totalPages: Math.ceil(result.total / limit),
          totalItem: result.total,
        });
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async blockAndUnblockUsers(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;
      const { isBlocked } = req.body;
      const result = await this._adminService.blockAndUnblockUsers(
        userId,
        isBlocked
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.NOT_FOUND).json({ msg: err.message });
    }
  }

  async blockAndUnblockDoctors(req: Request, res: Response): Promise<void> {
    try {
      const { id: doctorId } = req.params;

      const { isBlocked, reason } = req.body;

      const result = await this._adminService.blockAndUnblockDoctors(
        doctorId,
        isBlocked,
        reason
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.NOT_FOUND).json({ msg: err.message });
    }
  }
  async findUnprovedDoctors(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string);
      const limit = parseInt(req.query.limit as string);
      const search = req.query.search as string;

      const result = await this._adminService.findUnApprovedDoctors(
        page,
        limit,
        search
      );

      res
        .status(HttpStatus.OK)
        .json({
          data: result.doctors,
          currentPage: page,
          totalPages: Math.ceil(result.total / limit),
          totalItem: result.total,
        });
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.NOT_FOUND).json({ msg: err.message });
    }
  }
  async doctorApprove(req: Request, res: Response): Promise<void> {
    try {
      const { id: doctorId } = req.params;

      const result = await this._adminService.doctorApprove(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.NOT_FOUND).json({ msg: err.message });
    }
  }
  async doctorReject(req: Request, res: Response): Promise<void> {
    try {
      const { id: doctorId } = req.params;
      const { reason } = req.body;
      logger.debug('rejection reason', reason);
      const result = await this._adminService.doctorReject(doctorId, reason);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.NOT_FOUND).json({ msg: err.message });
    }
  }
  async getVerificationDoctorDetails(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id: doctorId } = req.params;
      const result = await this._adminService.getVerificationDoctorDetails(
        doctorId
      );

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async updateUserData(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;

      const formData = req.body;

      const imgData = (req.files as { [key: string]: Express.Multer.File[] })
        ?.profileImage?.[0];
      const profileImg = imgData?.path;

      const result = await this._adminService.updateUserData(
        formData,
        userId,
        profileImg
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }

  async editDoctorData(req: Request, res: Response): Promise<void> {
    try {
      const { id: doctorId } = req.params;
      logger.info('doctor id comming', doctorId);
      if (!doctorId) {
        res.status(HttpStatus.BAD_REQUEST).json({ msg: 'doctor id not found' });
        return;
      }

      const result = await this._adminService.editDoctorData(doctorId);
      logger.debug(result);
      res.status(HttpStatus.OK).json({ doctor: result });
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }


  async addUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, gender, dob, password } = req.body;
      const imgData = (req.files as { [key: string]: Express.Multer.File[] })
        ?.profileImage?.[0];
      const profileImg = imgData?.path;

      const result = await this._adminService.addUser(
        name,
        email,
        phone,
        gender,
        dob,
        password,
        profileImg
      );
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }

  async addDoctor(req: Request, res: Response): Promise<void> {
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
      const err = error as Error;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ msg: err.message });
    }
  }
  async getAllAppoinments(req: Request, res: Response): Promise<void> {
    try {
      logger.info('admin side appoinment request is comming');
      //  const page = parseInt(req.query.page as string);
      //  const limit = parseInt(req.query.limit as string);
      //  const search = req.query.search as string;
       logger.debug(req.query);
      const result = await this._adminService.getAllAppoinments();
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }

  async getDoctorSlotAndAppoinment(req: Request, res: Response): Promise<void> {
    try {
      const {doctorId} = req.params;
      logger.info('slots and appoinment request is comming to the back end');
      const result = await this._adminService.getDoctorSlotAndAppoinment(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
    }
  }
}
