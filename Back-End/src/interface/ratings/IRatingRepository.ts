import { IRating } from '../../models/interface/IRating';
import { IRatingDTO, IRatingPatient } from '../../types/ratingPatientDTO';

export interface IRatingRepository {
    create(ratingData:Partial<IRating>):Promise<IRating | null>;
    findByDoctorId(doctorId:string):Promise<(IRatingDTO & { patientId: IRatingPatient })[]>;
    findTopRatingByDoctorId(doctorId:string):Promise<(IRatingDTO & { patientId: IRatingPatient })[]>;
}