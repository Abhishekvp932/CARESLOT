import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import { generateOTP } from '../../utils/otp';

import { hashPassword, comparePassword } from '../../utils/hash';

import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import { Profile } from 'passport-google-oauth20';
import { IService } from '../../interface/auth/IAuthService';
import { MailService } from '../mail.service';
import { IPatient } from '../../models/interface/IPatient';
import { IBaseUser } from '../../utils/IBaseUser';
import { IpatientRepository } from '../../interface/auth/IAuthInterface';
import { IDoctorAuthRepository } from '../../interface/doctor/IDoctorRepository';
import { IAdminRepository } from '../../interface/admin/IAdminRepository';
import redisClient from '../../config/redisClient';

import { IDoctor } from '../../models/interface/IDoctor';
import { IAdmin } from '../../models/interface/IAdmin';
import { LogoutRequest } from '../../types/auth';
import { UserDTO } from '../../types/user.dto';
import { Request, Response } from 'express';
import logger from '../../utils/logger';
import dotenv from 'dotenv';
dotenv.config();
export class AuthService implements IService {
  constructor(
    private _patientRepository: IpatientRepository,
    private _doctorRepository: IDoctorAuthRepository,
    private _adminRepository: IAdminRepository
  ) {}

  async login(
    email: string,
    password: string
  ): Promise<{
    msg: string;
    user: IBaseUser;
    accessToken: string;
    refreshToken: string;
  }> {
    let user: IBaseUser | null = null;
    user = (await this._patientRepository.findByEmail(
      email
    )) as IBaseUser | null;
    let role = 'patients';
    if (!user) {
      user = (await this._doctorRepository.findByEmail(
        email
      )) as IBaseUser | null;
      role = 'doctors';
    }
    if (!user) {
      user = (await this._adminRepository.findByEmail(
        email
      )) as IBaseUser | null;
      role = 'admin';
    }

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    if (role === 'admin') {
      if (password !== user.password) {
        throw new Error(SERVICE_MESSAGE.PASSWORD_NOT_MATCH);
      }
    } else {
      if (
        (role === 'doctors' || role === 'patients') &&
        user?.isBlocked === true
      ) {
        throw new Error('The person blocked by the admin team');
      }

      const isPassword = await comparePassword(password, user.password);

      if (!isPassword) {
        throw new Error(SERVICE_MESSAGE.PASSWORD_NOT_MATCH);
      }
    }
    const payload: TokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return {
      msg: SERVICE_MESSAGE.USER_LOGIN_SUCCESS,
      user,
      accessToken,
      refreshToken,
    };
  }

  async signup(
    name: string,
    email: string,
    password: string,
    phone: string,
    dob: Date,
    gender: string,
    role: string
  ): Promise<{ msg: string }> {
    const otp = generateOTP();

    const otpExpire = new Date(Date.now() + 60 * 1000);
    const hashedPassword = await hashPassword(password);

    if (role === 'patients') {
      const existingUser = await this._patientRepository.findByEmail(email);
      if (existingUser) {
        throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
      }

      const newPatient = {
        name,
        email,
        DOB: dob,
        phone,
        gender: gender as 'male' | 'female' | 'others',
        password: hashedPassword,
        otp,
        otpExpire,
        isVerified: false,
        role: 'patients' as 'patients',
      };

      await this._patientRepository.create(newPatient);
    } else if (role === 'doctors') {
      const existingDoctor = await this._doctorRepository.findByEmail(email);

      if (existingDoctor) {
        throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
      }

      const newDoctor = {
        name,
        email,
        DOB: dob,
        phone,
        gender: gender as 'male' | 'female' | 'others',
        password: hashedPassword,
        otp,
        otpExpire,
        isVerified: false,
        role: 'doctors' as 'doctors',
      };

      await this._doctorRepository.create(newDoctor);
    }
    const mailService = new MailService();

    await mailService.sendMail(
      email,
      'Your OTP code',
      `Hi ${name},\n\nYour OTP is : ${otp}\nIt will expire in 1 minit.`
    );

    return { msg: 'otp send to your email id' };
  }
  async verifyOtp(email: string, otp: string): Promise<{msg:string,role:string,user:string}> {
    let user = null;
    user = await this._patientRepository.findByEmail(email);
    let role = 'patients';

    if (!user) {
      user = await this._doctorRepository.findByEmail(email);
      role = 'doctors';
    }
    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    if (role === 'patients') {
      await this._patientRepository.verifyOtp(email, otp);
    } else {
      await this._doctorRepository.verifyOtp(email, otp);
    }

    return { msg: SERVICE_MESSAGE.OTP_VERIFIED_SUCCESS, role, user: user._id as string};
  }


  async findOrCreateGoogleUser(profile: Profile): Promise<IPatient> {
    const existingUser: IPatient | null =
      await this._patientRepository.findByGoogleId(profile.id);
    if (existingUser) return existingUser;
    const newUser = await this._patientRepository.createWithGoogle(profile);
    if (!newUser) {
      throw new Error('Failed to create user with Google profile');
    }
    return newUser;
  }

  async findUserById(id: string): Promise<{ users: UserDTO }> {
    const usersData = await this._patientRepository.findById(id);

    if (!usersData) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    const users = {
      _id: String(usersData?._id),
      email: usersData?.email,
      name: usersData?.name,
      phone: usersData?.phone,
      gender: usersData?.gender,
      DOB: usersData?.DOB,
      isBlocked: usersData?.isBlocked,
      role: usersData?.role,
      createdAt: usersData?.createdAt,
      updatedAt: usersData?.updatedAt,
      profile_img: usersData?.profile_img,
    };
    return { users };
  }

  async logOut({ sessionId }: LogoutRequest): Promise<{ msg: string }> {
    if (!sessionId) throw new Error('session id missing');

    const accessToken = await redisClient.get(`access:${sessionId}`);
    const refreshToken = await redisClient.get(`refresh:${sessionId}`);

    // if(!accessToken || !refreshToken){
    //   throw new Error('Token not foud');
    // }
    const accessExp = (15 * 60) as number;
    const refreshExp = (7 * 24 * 60 * 60) as number;

    await redisClient.set(`bl_access:${accessToken}`, 'true', {
      EX: accessExp,
    });
    await redisClient.set(`bl_refresh:${refreshToken}`, 'true', {
      EX: refreshExp,
    });

    await redisClient.del(`access:${sessionId}`);
    await redisClient.del(`refresh:${sessionId}`);

    return { msg: 'logout success' };
  }

  async resendOTP(email: string): Promise<{ msg: string }> {
    let user = null;
    user = await this._patientRepository.findByEmail(email);
    let role = 'patients';
    if (!user) {
      user = await this._doctorRepository.findByEmail(email);
      role = 'doctors';
    }
    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const newOTp = generateOTP();

    const otpExpire = new Date(Date.now() + 60 * 1000);
    if (role === 'patients') {
      await this._patientRepository.upsertWithOTP(email, newOTp, otpExpire);
    } else if (role === 'doctors') {
      await this._doctorRepository.upsertWithOTP(email, newOTp, otpExpire);
    }

    const mailService = new MailService();
    await mailService.sendMail(
      email,
      'Resend OTP code',
      `Hi ${user.name},\n\nYour New OTP code is ${newOTp}\n It will expire in 1 minit.`
    );
    return { msg: SERVICE_MESSAGE.RESEND_OTP_SUCCESS };
  }

  async verifiyEmail(email: string): Promise<{ msg: string }> {
    let user = null;
    user = await this._patientRepository.findByEmail(email);
    let role = 'patients';

    if (!user) {
      user = await this._doctorRepository.findByEmail(email);
      role = 'doctors';
    }
    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const otp = generateOTP();

    const otpExpire = new Date(Date.now() + 60 * 1000);

    if (role === 'patients') {
      await this._patientRepository.upsertWithOTP(email, otp, otpExpire);
    } else {
      await this._doctorRepository.upsertWithOTP(email, otp, otpExpire);
    }
    const mailService = new MailService();
    await mailService.sendMail(
      email,
      'Password Change OTP code',
      `Hi ${user.name},\n\nYour OTP code is ${otp}\n It will expire in 1 minit.`
    );

    return { msg: SERVICE_MESSAGE.OTP_SEND_SUCCESS };
  }

  async verifyEmailOTP(email: string, otp: string): Promise<{ msg: string }> {
    let user: IPatient | IDoctor | IAdmin | null;

    user = await this._patientRepository.findByEmail(email);
    let role = 'patients';
    if (!user) {
      user = await this._doctorRepository.findByEmail(email);
      role = 'doctors';
    }

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    if (role === 'patients') {
      await this._patientRepository.verifyOtp(email, otp);
    } else {
      await this._doctorRepository.verifyOtp(email, otp);
    }

    return { msg: SERVICE_MESSAGE.OTP_VERIFIED_SUCCESS };
  }

  async forgotPassword(
    email: string,
    newPassword: string
  ): Promise<{ msg: string }> {
    let user: IPatient | IDoctor | IAdmin | null;
    user = await this._patientRepository.findByEmail(email);
    let role = 'patients';

    if (!user) {
      user = await this._doctorRepository.findByEmail(email);
      role = 'doctors';
    }

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const hashedPassword = await hashPassword(newPassword);

    if (role === 'patients') {
      await this._patientRepository.updatePasswordWithEmail(email, {
        password: hashedPassword,
      });
    } else {
    }

    return { msg: SERVICE_MESSAGE.PASSWORD_UPDATE_SUCCESS };
  }

  async refreshAccessToken(req: Request, res: Response): Promise<{msg:string}> {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      throw new Error('No session id found');
    }

    const storedRefreshToken = await redisClient.get(`refresh:${sessionId}`);

    if (!storedRefreshToken) {
      throw new Error('NO_REFRESH_TOKEN_OR_EXPIRED');
    }

    const decoded = verifyRefreshToken(storedRefreshToken);

    if (!decoded) {
      res.clearCookie('sessionId');
      return {msg:'Invalid or expired refresh token'};
    }

    let user: IPatient | IDoctor | IAdmin | null = null;
    if (decoded.role === 'patients') {
      user = await this._patientRepository.findById(decoded.id);
    } else if (decoded.role === 'doctors') {
      user = await this._doctorRepository.findById(decoded.id);
    } else if (decoded.role === 'admin') {
      user = await this._adminRepository.findById(decoded.id);
    }

    logger.info('refresh access token user data');
    logger.debug(user);


    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const payload: TokenPayload = {
      id: user._id as string,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    await redisClient.set(`access:${sessionId}`, newAccessToken, {
      EX:Number(process.env.ACCESS_TOKEN_EXPIRE_TIME),
    });
    await redisClient.set(`refresh:${sessionId}`, newRefreshToken, {
      EX:Number(process.env.REFRESH_TOKEN_EXPIRE_TIME),
    });

    return { msg: 'token refreshed' };
  }



  async getMe({ sessionId }: LogoutRequest): Promise<Partial<IPatient>> {
    const token = await redisClient.get(`access:${sessionId}`);

    if (!token) {
      throw new Error('Token not found');
    }

    const decode = verifyAccessToken(token);
    if (!decode) {
      throw new Error('user not found');
    }
    const user = await this._patientRepository.findById(decode?.id);

    if (!user) {
      throw new Error('User is missing');
    }

    return user;
  }
}
