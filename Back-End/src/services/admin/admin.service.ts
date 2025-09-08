import { IAdminService } from '../../interface/admin/admin.serivce.interface';

import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import { hashPassword } from '../../utils/hash';
import { IDoctor } from '../../models/interface/IDoctor';

import { IDoctor as Idoctors } from '../../interface/doctor/doctor.service.interface';
import { IpatientRepository } from '../../interface/auth/auth.interface';
import { IAdminRepository } from '../../interface/admin/admin.repo.interface';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import { IPatient } from '../../models/interface/IPatient';
import { DoctorListResult } from '../../types/doctorListResult';
import { UserListResult } from '../../types/userListsResult';
import { UserDTO } from '../../types/user.dto';
import { DoctorDTO } from '../../types/doctor.dto';
import { FilterQuery } from 'mongoose';
import { doctorDetails } from '../../types/doctorDetails';
import logger from '../../utils/logger';
import { MailService } from '../mail.service';
import redisClient from '../../config/redisClient';
import { verifyAccessToken } from '../../utils/jwt';
export class AdminService implements IAdminService {
  constructor(
    private _patientRepo: IpatientRepository,
    private _adminRepo: IAdminRepository,
    private _doctorAuthRepo: IDoctorAuthRepository
  ) {}

  async findAllUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<UserListResult> {
    const skip = (page - 1) * limit;

    const searchFilter: FilterQuery<IPatient> = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [userList, total] = await Promise.all([
      this._patientRepo.findAllWithPagination(skip, limit, searchFilter),
      this._patientRepo.countAll(searchFilter),
    ]);
    logger.info('search filter result', searchFilter);
    if (!userList) {
      throw new Error('No user found');
    }
    const users: UserDTO[] = userList.map((user) => ({
      _id: String(user?._id),
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      gender: user?.gender,
      DOB: user?.DOB,
      isBlocked: user?.isBlocked,
      role: user?.role,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      profile_img: user?.profile_img,
    }));

    return { users, total };
  }

  async findAllDoctors(
    page: number,
    limit: number,
    search: string
  ): Promise<DoctorListResult> {
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          isApproved: true,
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            {
              'qualifications.specialization': {
                $regex: search,
                $options: 'i',
              },
            },
          ],
        }
      : { isApproved: true };
    const [doctorsList, total] = await Promise.all([
      this._doctorAuthRepo.findAllWithPagination(skip, limit, searchFilter),
      this._doctorAuthRepo.countAll(searchFilter),
    ]);
    if (!doctorsList) {
      throw new Error('No doctors found');
    }
    const doctors: DoctorDTO[] = doctorsList.map((doctor) => ({
      _id: String(doctor?._id),
      email: doctor?.email,
      isBlocked: doctor?.isBlocked,
      isApproved: doctor?.isApproved,
      name: doctor?.name,
      DOB: doctor?.DOB,
      gender: doctor?.gender,
      role: doctor?.role,
      updatedAt: doctor?.updatedAt,
      createdAt: doctor?.createdAt,
      profile_img: doctor?.profile_img,
      qualifications: {
        degree: doctor?.qualifications?.degree,
        institution: doctor?.qualifications?.institution,
        experince:
          doctor?.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate: doctor?.qualifications?.educationCertificate,
        experienceCertificate: doctor?.qualifications?.experienceCertificate,
        graduationYear:
          doctor?.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor?.qualifications?.specialization,
        medicalSchool: doctor?.qualifications?.medicalSchool,
        about: doctor?.qualifications?.about,
        fees:
          doctor?.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor?.qualifications?.lisence,
      },
    }));

    return { doctors, total };
  }

  async blockAndUnblockUsers(
    userId: string,
    isBlocked: boolean
  ): Promise<{ msg: string }> {
    const user = await this._patientRepo.findById(userId);

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const updatedUser = await this._patientRepo.updateById(userId, {
      isBlocked,
    });

     const iter = await redisClient.keys('refresh:*');

    if (updatedUser?.isBlocked) {
     
     for await (const refreshKey of iter) {
  const key = refreshKey.toString(); 



  const sessionId = key.replace('refresh:', '');
  const accessKey = `access:${sessionId}`;



  const accessToken = await redisClient.get(accessKey);
  const refreshToken = await redisClient.get(key);
  



  if (!accessToken || !refreshToken) continue;

  const decode = verifyAccessToken(accessToken);
 
  // const updateUserID= updatedUser._id as string;

  if (decode?.id === userId) {
 

    await redisClient.set(`bl_access:${accessToken}`,'true',{EX:15 * 60});
    await redisClient.set(`bl_refresh:${refreshToken}`,'true',{EX:7 * 24 * 60 * 60});
    


    await redisClient.del(accessKey);
    await redisClient.del(key);
  }
}
      return { msg: 'User blocked successfully' };
    } else {
      return { msg: 'user unblocked successfully' };
    }
  }





  async blockAndUnblockDoctors(
    doctorId: string,
    isBlocked: boolean,
    reason: string
  ): Promise<{ msg: string }> {


    const doctor = await this._doctorAuthRepo.findById(doctorId);
    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
         
    await this._doctorAuthRepo.updateById(doctorId, {
      isBlocked,
      blockReason: reason,
    });

   const response = {
      msg: isBlocked
        ? 'Doctor blocked successfully'
        : 'Doctor unblocked successfully',
    };
    
    (async ()=>{
      try {
         const mailService = new MailService();
   const iter = await redisClient.keys('refresh:*');
    if (isBlocked) {
      await mailService.sendMail(
        doctor?.email,
        'Account Suspension Notification',
        `Dear Dr.${doctor?.name},

     We regret to inform you that your account on Our Platform has been temporarily blocked by the administrator.

    Reason for suspension: ${reason}

    If you believe this was a mistake or would like to appeal this decision, please contact our support team at careslot@gmail.com.

    We appreciate your understanding and cooperation.

   Best regards,
    The CARESLOT Team`
      );
         

for await (const refreshKey of iter){
  const key = refreshKey.toString();
   

  const sessionId = key.replace('refresh:','');
  const accessKey = `access:${sessionId}`;


  const accessToken = await redisClient.get(accessKey);
  const refreshToken = await redisClient.get(key);



  if(!accessToken || !refreshToken) continue;

  const decode = verifyAccessToken(accessToken);


  if(decode?.id === doctorId){
    
    await redisClient.set(`bl_access:${accessToken}`,'true',{EX:15 * 60});
    await redisClient.set(`bl_refresh:${refreshToken}`,'true',{EX:7 * 24 * 60 * 60});
  
    await redisClient.del(accessKey);
    await redisClient.del(key);
  }

}

    } else {
      await this._doctorAuthRepo.updateById(doctorId, {
        $unset: { blockReason: '' },
        $set: { isBlocked: false },
      });
      await mailService.sendMail(
        doctor?.email,
        'Account Reinstatement Notification',
        `Dear Dr.${doctor?.name},

    We are pleased to inform you that your account on Our Platform has been reinstated and you can now access all services as usual.

    We appreciate your patience and cooperation during the review process.

    If you have any questions or require further assistance, please reach out to our support team at careslot@gmail.com.

   Best regards,
   The CARESLOT Team`
      );
    }

      } catch (error:any) {
        throw new Error(error);
      }
    });

    return response;
  }



  async findUnApprovedDoctors(
    page: number,
    limit: number,
    search: string
  ): Promise<DoctorListResult> {
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          isApproved: false,
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            {
              'qualifications.specialization': {
                $regex: search,
                $options: 'i',
              },
            },
          ],
        }
      : { isApproved: false };

    const [doctorsList, total] = await Promise.all([
      this._doctorAuthRepo.findAllWithPagination(skip, limit, searchFilter),
      this._doctorAuthRepo.countAll(searchFilter),
    ]);
    if (!doctorsList) {
      throw new Error('No doctors found');
    }
    const doctors: DoctorDTO[] = doctorsList.map((doctor) => ({
      _id: String(doctor?._id),
      email: doctor?.email,
      isBlocked: doctor?.isBlocked,
      isApproved: doctor?.isApproved,
      name: doctor?.name,
      DOB: doctor?.DOB,
      gender: doctor?.gender,
      role: doctor?.role,
      updatedAt: doctor?.updatedAt,
      isRejected:doctor?.isRejected,
      createdAt: doctor?.createdAt,
      profile_img: doctor?.profile_img,
      qualifications: {
        degree: doctor?.qualifications?.degree,
        institution: doctor?.qualifications?.institution,
        experince:
          doctor?.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate: doctor?.qualifications?.educationCertificate,
        experienceCertificate: doctor?.qualifications?.experienceCertificate,
        graduationYear:
          doctor?.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor?.qualifications?.specialization,
        medicalSchool: doctor?.qualifications?.medicalSchool,
        about: doctor?.qualifications?.about,
        fees:
          doctor?.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor?.qualifications?.lisence,
      },
    }));
    return { doctors, total };
  }




  async doctorApprove(doctorId: string): Promise<{ msg: string }> {
    const doctors = await this._doctorAuthRepo.findById(doctorId);
    if (!doctors) {
      throw new Error('No dotors found');
    }
    await this._doctorAuthRepo.updateById(doctorId, {
      $unset: { rejectionReason: '' },
      $set: { isApproved: true,isRejected:false },
    });
   const response = {msg: 'Doctors Approved successfully'};

   (async ()=>{
    try {
      
    const mailService = new MailService();
    await mailService.sendMail(
      doctors?.email,
      'Applicarion Approved - CARESLOT',
      `Dear Dr.${doctors?.name},

We are delighted to inform you that your application to join CARESLOT has been approved!

You can now start managing your appointments and connecting with patients through our platform.

If you have any questions or need assistance getting started, feel free to reach out to our support team at careslot@gmail.com.

Welcome aboard, and we look forward to supporting you on this journey!

Best regards,  
The CARESLOT Team`
    );

    } catch (error:any) {
      throw new Error(error);
    }
   });
    return response;
  }

  async doctorReject(
    doctorId: string,
    reason: string
  ): Promise<{ msg: string }> {
    const doctor = await this._doctorAuthRepo.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    await this._doctorAuthRepo.updateById(doctorId, {
      rejectionReason: reason,
      isApproved: false,
      isRejected:true,
    });
    const response = {msg:'Doctor reject successfully'};
     
    (async ()=>{
      try {
        const mailService = new MailService();
    await mailService.sendMail(
      doctor.email,
      'Application Rejected – CARESLOT',
      `
    Dear Dr. ${doctor.name},

    We regret to inform you that your application on CARESLOT has been reviewed and unfortunately did not meet our approval criteria at this time.

    Reason for Rejection: ${reason}

    If you believe this decision was made in error or would like to reapply in the future, please feel free to contact our support team at careslot@gmail.com

    Thank you for your interest in joining our platform.
    Best regards,
    The CARESLOT Team
  `
    );
      } catch (error:any) {
        throw new Error(error);
      }
    });

    return response;
  }



  async getVerificationDoctorDetails(doctorId: string): Promise<doctorDetails> {
    const doctor = await this._doctorAuthRepo.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    const doctors: doctorDetails = {
      _id: String(doctor._id),
      email: doctor.email,
      isBlocked: doctor.isBlocked ?? undefined,
      isApproved: doctor.isApproved ?? undefined,
      name: doctor.name,
      DOB: doctor.DOB ? new Date(doctor.DOB) : undefined,
      gender: doctor.gender ?? undefined,
      isRejected:doctor.isRejected ?? undefined,
      role: doctor.role ?? 'doctors',
      updatedAt: doctor.updatedAt ? new Date(doctor.updatedAt) : undefined,
      createdAt: doctor.createdAt ? new Date(doctor.createdAt) : undefined,
      profile_img: doctor.profile_img ?? undefined,
      qualifications: {
        degree: doctor.qualifications?.degree ?? undefined,
        institution: doctor.qualifications?.institution ?? undefined,
        experince:
          doctor.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate:
          doctor.qualifications?.educationCertificate ?? undefined,
        experienceCertificate:
          doctor.qualifications?.experienceCertificate ?? undefined,
        graduationYear:
          doctor.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor.qualifications?.specialization ?? undefined,
        medicalSchool: doctor.qualifications?.medicalSchool ?? undefined,
        about: doctor.qualifications?.about ?? undefined,
        fees:
          doctor.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor.qualifications?.lisence ?? undefined,
      },
    };

    return doctors;
  }

  async updateUserData(
    formData: Partial<IPatient>,
    userId: string,
    profileImage?: string
  ): Promise<{ msg: string }> {
    const user = await this._patientRepo.findById(userId);

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    await this._patientRepo.updateById(userId, {
      ...formData,
      profile_img: profileImage,
    });

    return { msg: 'user profile updated successfully' };
  }

  async editDoctorData(doctorId: string): Promise<doctorDetails> {
    const doctor = await this._doctorAuthRepo.findById(doctorId);
    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    const doctors: doctorDetails = {
      _id: String(doctor._id),
      email: doctor.email,
      isBlocked: doctor.isBlocked ?? undefined,
      isApproved: doctor.isApproved ?? undefined,
      name: doctor.name,
      DOB: doctor.DOB ? new Date(doctor.DOB) : undefined,
      gender: doctor.gender ?? undefined,
      role: doctor.role ?? 'doctors',
      updatedAt: doctor.updatedAt ? new Date(doctor.updatedAt) : undefined,
      createdAt: doctor.createdAt ? new Date(doctor.createdAt) : undefined,
      profile_img: doctor.profile_img ?? undefined,
      qualifications: {
        degree: doctor.qualifications?.degree ?? undefined,
        institution: doctor.qualifications?.institution ?? undefined,
        experince:
          doctor.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate:
          doctor.qualifications?.educationCertificate ?? undefined,
        experienceCertificate:
          doctor.qualifications?.experienceCertificate ?? undefined,
        graduationYear:
          doctor.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor.qualifications?.specialization ?? undefined,
        medicalSchool: doctor.qualifications?.medicalSchool ?? undefined,
        about: doctor.qualifications?.about ?? undefined,
        fees:
          doctor.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor.qualifications?.lisence ?? undefined,
      },
    };

    return doctors;
  }
  async editDoctorProfile(
    doctorId: string,
    data: Partial<Idoctors>
  ): Promise<{ msg: string }> {
    const doctor = await this._doctorAuthRepo.findById(doctorId);
    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    await this._doctorAuthRepo.updateById(doctorId, data);

    return { msg: 'doctor profile updated successfully' };
  }
  async addUser(
    name: string,
    email: string,
    phone: string,
    gender: string,
    dob: Date,
    password: string,
    profileImage?: string
  ): Promise<{ msg: string }> {
    const user = await this._patientRepo.findByEmail(email);
    if (user) {
      throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await hashPassword(password);
    const newUser = {
      name,
      email,
      phone,
      gender: gender as 'male' | 'female' | 'others',
      DOB: dob,
      profile_img: profileImage,
      password: hashedPassword,
      isVerified: true,
    };
    await this._patientRepo.create(newUser);

    return { msg: 'User add successfully' };
  }
  async addDoctor(data: unknown): Promise<{ msg: string }> {
    const doctorData = data as Partial<IDoctor>;
    if (!doctorData.email) {
      throw new Error('Email is required');
    }
    const doctor = await this._doctorAuthRepo.findByEmail(doctorData.email);
    if (doctor) {
      throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
    }
    await this._doctorAuthRepo.create(doctorData);
    return { msg: 'New doctor added successfully' };
  }
}
