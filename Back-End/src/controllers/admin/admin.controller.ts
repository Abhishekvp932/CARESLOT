import { AdminService } from "../../services/admin/admin.service";
import IAdminController from "../../interface/admin/admin.controller.interface";
import { Request, Response } from "express";
import { HttpStatus } from "../../utils/httpStatus";
import { IAdminService } from "../../interface/admin/admin.serivce.interface";
import { CONTROLLER_MESSAGE } from "../../utils/controllerMessage";
export class AdminController implements IAdminController {
  constructor(private adminService: IAdminService) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminService.findAllUsers();
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminService.findAllDoctors();

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
    }
  }
  async blockAndUnblockUsers(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;
      const { isBlocked } = req.body;
      const result = await this.adminService.blockAndUnblockUsers(
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

      const { isBlocked } = req.body;

      const result = await this.adminService.blockAndUnblockDoctors(
        doctorId,
        isBlocked
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error;

      res.status(HttpStatus.NOT_FOUND).json({ msg: err.message });
    }
  }
  async findUnprovedDoctors(req: Request, res: Response): Promise<void> {
      try {
        const result = await this.adminService.findUnApprovedDoctors();

        res.status(HttpStatus.OK).json(result)
      } catch (error) {
        const err = error as Error

        res.status(HttpStatus.NOT_FOUND).json({msg:err.message})
      }
  }
  async doctorApprove(req: Request, res: Response): Promise<void> {
    try {
      const {id:doctorId} = req.params
      console.log('approing doctor id is',doctorId);
      const result = await this.adminService.doctorApprove(doctorId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error

      res.status(HttpStatus.NOT_FOUND).json({msg:err.message})
    }
  }
  async doctorReject(req: Request, res: Response): Promise<void> {
    try {
      const {id:doctorId} = req.params

      const result = await this.adminService.doctorReject(doctorId)

    } catch (error) {
      const err = error as Error

      res.status(HttpStatus.NOT_FOUND).json({msg:err.message})
    }
  }
  async getVerificationDoctorDetails(req: Request, res: Response): Promise<void> {
    try {
      const {id:doctorId} = req.params
      const result = await this.adminService.getVerificationDoctorDetails(doctorId);
      console.log(result);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
      
    }
  }
  async updateUserData(req: Request, res: Response): Promise<void> {
  try {
    const { id: userId } = req.params;
    console.log('updating user id is',userId);
    const formData = req.body;

    const imgData = (req.files as { [key: string]: Express.Multer.File[] })?.profileImage?.[0];
    const profileImg = imgData?.path;

    const result = await this.adminService.updateUserData(formData, userId, profileImg);
    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(HttpStatus.BAD_REQUEST).json({ msg: err.message });
  }
}

async editDoctorData(req: Request, res: Response): Promise<void> {
  
  try {
    const {id:doctorId} = req.params
   
      if(!doctorId){
        res.status(HttpStatus.BAD_REQUEST).json({msg:"doctor id not found"});
        return;
      }

      const result = await this.adminService.editDoctorData(doctorId);
      res.status(HttpStatus.OK).json(result);
  } catch (error) {
    const err = error as Error
    res.status(HttpStatus.BAD_REQUEST).json({msg:err.message});
    
  }
}
async editDoctorProfile(req: Request, res: Response): Promise<void> {
  try {
    const { id: doctorId } = req.params;
    const rawData = req.body;

    const files = req.files as {
      [key: string]: Express.Multer.File[];
    };

    const data: any = {
      name: rawData.name,
      email: rawData.email,
      phone: rawData.phone,
      DOB: rawData.DOB,
      gender: rawData.gender,
    };

    if (files?.profileImage?.[0]) {
      data.profile_img = files.profileImage[0].path;
    }


    data.qualifications = {
      degree: rawData.degree,
      institution: rawData.institution,
      specialization: rawData.specialization,
      medicalSchool: rawData.medicalSchool,
      experince: parseInt(rawData.experince),
      graduationYear: parseInt(rawData.graduationYear),
      license: rawData.license,
      about: rawData.about,
      fees: parseInt(rawData.fees),
    };

 
    if (files?.educationCertificate?.[0]) {
      data.qualifications.educationCertificate = files.educationCertificate[0].path;
    } else if (
      rawData.educationCertificate &&
      typeof rawData.educationCertificate === "string"
    ) {
      data.qualifications.educationCertificate = rawData.educationCertificate;
    }


    if (files?.experienceCertificate?.[0]) {
      data.qualifications.experienceCertificate = files.experienceCertificate[0].path;
    } else if (
      rawData.experienceCertificate &&
      typeof rawData.experienceCertificate === "string"
    ) {
      data.qualifications.experienceCertificate = rawData.experienceCertificate;
    }



    const result = await this.adminService.editDoctorProfile(doctorId, data);
    res.status(200).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ msg: err.message });
  }
}

}
