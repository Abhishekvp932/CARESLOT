import { IDoctorAuthRepository } from "../../interface/doctor/doctor.auth.interface";
import Doctor from "../../models/implementation/doctor.model";
import { Profile } from "passport-google-oauth20";
import { SERVICE_MESSAGE } from "../../utils/ServiceMessage";
import { BaseRepository } from "../base.repository";
import { IDoctor } from "../../models/interface/IDoctor";

export class DoctorAuthRepository extends BaseRepository<IDoctor> implements IDoctorAuthRepository{
     
  constructor (){
    super(Doctor);
  }
  async updateById(id: string, update: Partial<any>) {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }
  async upsertWithOTP(email: string, otp: string, otpExpire: Date) {
    return this.model.findOneAndUpdate(
      { email },
      { otp, otpExpire },
      { upsert: true, new: true }
    );
  }
  async verifyOtp(email: string, otp: string) {
    const doctor = await this.findByEmail(email);

    if (
      !doctor ||
      doctor.otp !== otp ||
      !doctor.otpExpire ||
      new Date() > new Date (doctor.otpExpire)
    ){
       throw new Error(SERVICE_MESSAGE.INVALID_OTP_EXPIRE_OTP);
    }
    doctor.otp = undefined;
    doctor.otpExpire = undefined;
    await doctor.save();

    return true;
  }

  async findByGoogleId(googleId: string) {
    return await this.model.findOne({ googleId });
  }
  async createWithGoogle(profile: Profile) {
    const doctor = new Doctor({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0].value,
    });
    return await doctor.save();
  }
  async updatePasswordWithEmail(email: string, update:any) {
    return  await this.model.findOneAndUpdate(
      {email},
      {$set:{password:update.password}},
      {new:true}
    );
  }
   async findByIdAndDelete(id: string): Promise<any> {
     return await this.model.findByIdAndDelete(id)
   }
 
}