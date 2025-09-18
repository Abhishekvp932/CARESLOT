import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import Doctor from '../../models/implementation/doctor.model';
import { Profile } from 'passport-google-oauth20';
import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import { BaseRepository } from '../base.repository';
import { IDoctor } from '../../models/interface/IDoctor';
import { FilterQuery, UpdateQuery } from 'mongoose';

export class DoctorAuthRepository extends BaseRepository<IDoctor> implements IDoctorAuthRepository{
     
  constructor (){
    super(Doctor);
  }
  async updateById(id: string, update: UpdateQuery<IDoctor>):Promise<IDoctor | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }
  async upsertWithOTP(email: string, otp: string, otpExpire: Date) {
    return this.model.findOneAndUpdate(
      { email },
      { otp, otpExpire },
      { upsert: true, new: true }
    );
  }
  async verifyOtp(email: string, otp: string):Promise<boolean>{
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

  async findByGoogleId(googleId: string):Promise<IDoctor | null>{
    return await this.model.findOne({ googleId });
  }
  async createWithGoogle(profile: Profile):Promise<IDoctor | null>{
    const doctor = new Doctor({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0].value,
    });
    return await doctor.save();
  }
  async updatePasswordWithEmail(email: string, update:Partial<IDoctor>):Promise<IDoctor | null> {
    return  await this.model.findOneAndUpdate(
      {email},
      {$set:{password:update.password}},
      {new:true}
    );
  }
   async findByIdAndDelete(id: string):Promise<IDoctor | null>{
     return await this.model.findByIdAndDelete(id);
   }

   async findAllWithPagination(skip: number, limit: number,  filter: FilterQuery<IDoctor> = {}): Promise<IDoctor[]> {
      return this.model.find(filter)
      .sort({createdAt:-1})
      .skip(skip)
      .limit(limit)
      .lean();
   }
        async countAll( filter: FilterQuery<IDoctor> = {}):Promise<number> {
            return this.model.countDocuments(filter);
        }



    async uploadDocument(doctorId: string, data:Partial<IDoctor>): Promise<IDoctor | null> {
  return await Doctor.findByIdAndUpdate(
    doctorId,
    {
      $set: {
        profile_img: data.profile_img,
        qualifications: data.qualifications,
      },
    },
    { new: true }
  );
}

async findRelatedDoctors(specialization: string, excludeId: string, limit = 5): Promise<IDoctor[]> {
  return await Doctor.find({
    'qualifications.specialization': specialization,
    _id: { $ne: excludeId }
  }).limit(limit).exec();
}

async findAllWithFilter(filter: FilterQuery<IDoctor>): Promise<IDoctor[]> {
  return Doctor.find(filter);
}

async findAppoinmentDoctors(filter:FilterQuery<IDoctor>): Promise<IDoctor[]> {
  return await Doctor.find(filter);
}


 
}