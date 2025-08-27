import Patient from '../../models/implementation/patient.model';
import { IpatientRepository } from '../../interface/auth/auth.interface';
import { Profile } from 'passport-google-oauth20';
import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import { BaseRepository } from '../base.repository';
import { IPatient } from '../../models/interface/IPatient';

export class PatientRepository extends BaseRepository<IPatient> implements IpatientRepository {
  constructor(){
    super(Patient);
  }
 

    async updateById(id: string, update: Partial<any>) {
      return await this.model.findByIdAndUpdate(id, update, { new: true });
    }
  async upsertWithOTP(email: string, otp: string, otpExpire: Date) {
    return Patient.findOneAndUpdate(
      { email },
      { otp, otpExpire },
      { upsert: true, new: true }
    );
  }
  async verifyOtp(email: string, otp: string) {
    const user = await this.findByEmail(email);

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpire ||
      new Date() > new Date (user.otpExpire)
    ){
       throw new Error(SERVICE_MESSAGE.INVALID_OTP_EXPIRE_OTP);
    }
      
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    return true;
  }

  async findByGoogleId(googleId: string) {
    return await this.model.findOne({ googleId });
  }
  async createWithGoogle(profile: Profile) {
    const user = new Patient({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0].value,
    });
    return await user.save();
  }
  async updatePasswordWithEmail(email: string, update:any) {
    return  await this.model.findOneAndUpdate(
      {email},
      {$set:{password:update}},
      {new:true}
    );
  }

   async findAllWithPagination(skip: number, limit: number,filter?:Partial<IPatient>): Promise<IPatient[]> {
        return this.model.find(filter).sort({createdAt:-1}).skip(skip).limit(limit).lean();
     }
     
          async countAll(filter?:Partial<IPatient>): Promise<number> {
              return this.model.countDocuments(filter);
          }
   
}
