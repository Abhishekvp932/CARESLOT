
import { IRatingDTO } from '../../types/ratingPatientDTO';

export interface IRatingService{
    addRating(doctorId:string,patientId:string,rating:number,review:string):Promise<{msg:string}>
    findDoctorRating(doctorId:string):Promise<IRatingDTO[]>
}