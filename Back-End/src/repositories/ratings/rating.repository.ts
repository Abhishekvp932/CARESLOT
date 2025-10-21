import { IRatingRepository } from '../../interface/ratings/IRatingRepository';
import Rating from '../../models/implementation/rating.model';
import { IRating } from '../../models/interface/IRating';
import { IRatingDTO, IRatingPatient } from '../../types/ratingPatientDTO';
import { BaseRepository } from '../base.repository';
export class RatingRepository extends BaseRepository <IRating> implements IRatingRepository{
    constructor(){
        super(Rating);
    }
   async findByDoctorId(doctorId: string): Promise<(IRatingDTO & { patientId: IRatingPatient })[]> {
       const ratings =  await Rating.find({doctorId:doctorId})
       .populate<{patientId:IRatingPatient}>('patientId', 'name').exec();     
       
       return ratings as unknown as (IRatingDTO & { patientId: IRatingPatient })[];
   }
}