import { IPrescription } from '../../models/interface/IPrescription';
import { BaseRepository } from '../base.repository';
import { IPrecriptionRepository } from '../../interface/prescription/IPrescriptionRepository';
import Prescription from '../../models/implementation/prescription.model';
import mongoose from 'mongoose';
import { PrescriptionDTO } from '../../types/PrescriptionDTO';

export class PrescriptionRepository extends BaseRepository<IPrescription> implements IPrecriptionRepository {
    constructor(){
        super(Prescription);
    }
    async findByAppoinmentId(appoinmentId: string): Promise<PrescriptionDTO> {
        const result = await Prescription.aggregate([
    {
      $match: {
        appoinmentId: new mongoose.Types.ObjectId(appoinmentId),
      },
    },
    {
      $lookup: {
        from: 'appoinments',
        localField: 'appoinmentId',
        foreignField: '_id',
        as: 'appoinment',
      },
    },
    { $unwind: '$appoinment' },

   
    {
      $lookup: {
        from: 'doctors',
        localField: 'appoinment.doctorId',
        foreignField: '_id',
        as: 'doctor',
      },
    },
    { $unwind: '$doctor' },
    {
      $lookup: {
        from: 'patients',
        localField: 'appoinment.patientId',
        foreignField: '_id',
        as: 'patient',
      },
    },
    { $unwind: '$patient' },
    {
      $project: {
        _id: 1,
        'appoinment._id': 1,
        'appoinment.slot.date': 1,
        'appoinment.slot.startTime': 1,
        'doctor.name': 1,
        'doctor.qualifications.specialization': 1,
        'patient.name': 1,
        medicines: 1,
        diagnosis:1,
        advice:1,
        notes: 1,
        createdAt: 1,
      },
    },
  ]);

  return result[0]; 
    }
}