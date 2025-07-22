import { PatientRepository } from "../../repositories/auth/auth.repository";
import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import { generateOTP } from "../../utils/otp";
import bcrypt from "bcrypt";
import { hashPassword, comparePassword } from "../../utils/hash";
import { stringify } from "querystring";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../../utils/jwt";
import { Profile } from "passport-google-oauth20";
import { IService } from "../../interface/auth/IService.interface";
import { MailService } from "../mail.service";
import { DoctorAuthRepository } from "../../repositories/doctors/doctor.auth.repository";
import { AdminRepository } from "../../repositories/admin/admin.repository";
import { IBaseUser } from "../../utils/IBaseUser";
import { HttpStatus } from "../../utils/httpStatus";
export class AuthService implements IService {
  constructor(
    private PatientRepo: PatientRepository,
    private doctorRepo: DoctorAuthRepository,
    private adminRepo: AdminRepository
  ) {}

  async login(email: string, password: string): Promise<any> {
    let user: IBaseUser | null = null;
    user = (await this.PatientRepo.findByEmail(email)) as IBaseUser | null;
    let role = "patients";
    if (!user) {
      user = (await this.doctorRepo.findByEmail(email)) as IBaseUser | null;
      role = "doctors";
    }
    if (!user) {
      
      user = (await this.adminRepo.findByEmail(email)) as IBaseUser | null;
      role = "admin";
    }
   
    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    if (role === "admin") {
      if (password !== user.password) {
        throw new Error(SERVICE_MESSAGE.PASSWORD_NOT_MATCH);
      }
    } else {
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
  ): Promise<any> {
    const otp = generateOTP();
    console.log("otp is", otp);
    const otpExpire = new Date(Date.now() + 60 * 1000);
    const hashedPassword = await hashPassword(password);

    if (role === "patients") {
      const existingUser = await this.PatientRepo.findByEmail(email);
      if (existingUser) {
        throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
      }

      const newPatient = {
        name,
        email,
        DOB: dob,
        phone,
        gender: gender as "male" | "female" | "others",
        password: hashedPassword,
        otp,
        otpExpire,
        isVerified: false,
        role: "patients" as "patients",
      };

      await this.PatientRepo.create(newPatient);
    } else if (role === "doctors") {
      const existingDoctor = await this.doctorRepo.findByEmail(email);

      if (existingDoctor) {
        throw new Error(SERVICE_MESSAGE.USER_ALREADY_EXISTS);
      }

      const newDoctor = {
        name,
        email,
        DOB: dob,
        phone,
        gender: gender as "male" | "female" | "others",
        password: hashedPassword,
        otp,
        otpExpire,
        isVerified: false,
        role: "doctors" as "doctors",
      };

      await this.doctorRepo.create(newDoctor);
    }
    const mailService = new MailService();

    await mailService.sendMail(
      email,
      `Your OTP code`,
      `Hi ${name},\n\nYour OTP is : ${otp}\nIt will expire in 1 minit.`
    );

    return;
  }
  async verifyOtp(email: string, otp: string): Promise<any> {
    let user = null;
    user = await this.PatientRepo.findByEmail(email);
    let role = "patients";

    if (!user) {
      user = await this.doctorRepo.findByEmail(email);
      role = "doctors";
    }
    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    if (role === "patients") {
      await this.PatientRepo.verifyOtp(email, otp);
    } else {
      await this.doctorRepo.verifyOtp(email, otp);
    }

    return { msg: SERVICE_MESSAGE.OTP_VERIFIED_SUCCESS, role, user: user._id };
  }

  async findOrCreateGoogleUser(profile: Profile): Promise<any> {
    const existingUser = await this.PatientRepo.findByGoogleId(profile.id);
    if (existingUser) return existingUser;
    const newUser = await this.PatientRepo.createWithGoogle(profile);
    return newUser;
  }
  async findUserById(id: string): Promise<any> {
    return await this.PatientRepo.findById(id);
  }

  async logOut(): Promise<string> {
    return "Logout success";
  }
  async resendOTP(email: string): Promise<any> {
    let user = null;
    user = await this.PatientRepo.findByEmail(email);
    let role = "patients";
    if (!user) {
      user = await this.doctorRepo.findByEmail(email);
      role = "doctors";
    }
    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const newOTp = generateOTP();
    console.log("resend otp", newOTp);
    const otpExpire = new Date(Date.now() + 60 * 1000);
    if (role === "patients") {
      await this.PatientRepo.upsertWithOTP(email, newOTp, otpExpire);
    } else if (role === "doctors") {
      await this.doctorRepo.upsertWithOTP(email, newOTp, otpExpire);
    }

    const mailService = new MailService();
    await mailService.sendMail(
      email,
      "Resend OTP code",
      `Hi ${user.name},\n\nYour New OTP code is ${newOTp}\n It will expire in 1 minit.`
    );
    return { msg: SERVICE_MESSAGE.RESEND_OTP_SUCCESS };
  }
  async verifiyEmail(email: string): Promise<any> {
    let user = null;
    user = await this.PatientRepo.findByEmail(email);
    let role = "patients";

    if (!user) {
      user = await this.doctorRepo.findByEmail(email);
      role = "doctors";
    }
    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 60 * 1000);

    if (role === "patients") {
      await this.PatientRepo.upsertWithOTP(email, otp, otpExpire);
    } else {
      await this.doctorRepo.upsertWithOTP(email, otp, otpExpire);
    }
    const mailService = new MailService();
    await mailService.sendMail(
      email,
      "Password Change OTP code",
      `Hi ${user.name},\n\nYour OTP code is ${otp}\n It will expire in 1 minit.`
    );

    return { msg: SERVICE_MESSAGE.OTP_SEND_SUCCESS };
  }
  async verifyEmailOTP(email: string, otp: string): Promise<any> {
    let user = null;
    user = await this.PatientRepo.findByEmail(email);
    let role = "patients";
    if (!user) {
      user = await this.doctorRepo.findByEmail(email);
      role = "doctors";
    }

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    if (role === "patients") {
      await this.PatientRepo.verifyOtp(email, otp);
    } else {
      await this.doctorRepo.verifyOtp(email, otp);
    }

    return { msg: SERVICE_MESSAGE.OTP_VERIFIED_SUCCESS };
  }
  async forgotPassword(email: string, newPassword: string): Promise<any> {
    const user = await this.PatientRepo.findByEmail(email);
    console.log("user is ", user);
    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const hashedPassword = await hashPassword(newPassword);
    const updated = await this.PatientRepo.updatePasswordWithEmail(
      email,
      hashedPassword
    );

    console.log("updated user is", updated);

    return { msg: SERVICE_MESSAGE.PASSWORD_UPDATE_SUCCESS };
  }
  async refreshAccessToken(req: any, res: any): Promise<any> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token provieded");
      return;
    }
    const decoded = verifyRefreshToken(refreshToken);
    console.log('decode',decoded);
    if (!decoded) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(403).json({ msg: "Invalid or expired refresh token" });
    }
    let user: any;
    if (decoded.role === "patient") {
      user = await this.PatientRepo.findById(decoded.id);
    } else if (decoded.role === "doctor") {
      user = await this.doctorRepo.findById(decoded.id);
    } else if (decoded.role === "admin") {
      user = await this.adminRepo.findById(decoded.id);
    }
    const payload: TokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.OK).json({ msg: "token refreshed" });
  }
}
