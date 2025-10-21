import { IRatingService } from '../../interface/ratings/IRatingService';
import { IRatingRepository } from '../../interface/ratings/IRatingRepository';
import { IDoctorAuthRepository } from '../../interface/doctor/IDoctorRepository';
import { IpatientRepository } from '../../interface/auth/IAuthInterface';
import { Types } from 'mongoose';

import { IRatingDTO } from '../../types/ratingPatientDTO';
import logger from '../../utils/logger';
export class RatingService implements IRatingService{
    constructor(private _ratingRepository:IRatingRepository,private _doctorRepository:IDoctorAuthRepository,private _patientRepository:IpatientRepository){}

    async addRating(doctorId:string,patientId:string,rating: number, review: string): Promise<{ msg: string }> {
      const doctor = await this._doctorRepository.findById(doctorId);

      if(!doctor){
        throw new Error('Doctor Not found');
      }
      const patient = await this._patientRepository.findById(patientId);
      if(!patient){
        throw new Error('Patient Not found');
      }
      const newRating = {
        doctorId:new Types.ObjectId(doctor?._id as string),
        patientId:new Types.ObjectId(patient?._id as string),
        rating:rating,
        comment:review
      };
      await this._ratingRepository.create(newRating);

      const totalCount = doctor.totalRating || 0;
      const oldAvarage = doctor.avgRating || 0;


      const newAvarage = ((oldAvarage * totalCount) + rating) / (totalCount + 1);
     const newCount = totalCount + 1;
     let filter = {avgRating:newAvarage,totalRating:newCount};

     await this._doctorRepository.updateById(doctor?._id as string,filter);
    return {msg:'Your Response Added'};
    }
    async findDoctorRating(doctorId: string): Promise<IRatingDTO[]> {
        const doctor = await this._doctorRepository.findById(doctorId);

        if(!doctor){
            throw new Error('Doctor Not found');
        }
        const ratings = await this._ratingRepository.findByDoctorId(doctor?._id as string);
        logger.debug(ratings);
        return ratings;
    }
}