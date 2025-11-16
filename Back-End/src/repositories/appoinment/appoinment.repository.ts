import { IAppoinment } from '../../models/interface/IAppoinments';
import Appoinment from '../../models/implementation/appoinment.model';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import { ClientSession, FilterQuery, Types } from 'mongoose';

import { IPatientPopulated, ITransactionPopulated } from '../../types/AppointsAndPatientsDto';
import { IDoctorPopulated } from '../../types/AppoinmentsAndDoctorDto';
import { AppoinmentPopulatedDTO } from '../../types/AppoinmentDTO';
import { DashboardData } from '../../types/IAdminDashboardDataLookup';
import { DoctorDashboardData } from '../../types/IDoctorDashboardDto';
import { TopTenAppointmentsDTO } from '../../types/TopTenAppoinmentsDTO';


export class AppoinmentRepository implements IAppoinmentRepository {

  async create(data: Partial<IAppoinment>,session?:ClientSession): Promise<IAppoinment | null> {
    const newAppoinment = new Appoinment(data);
    return await newAppoinment.save({session});
  }

  async findByDoctorId(doctorId: string): Promise<IAppoinment[]> {
    return await Appoinment.find({ doctorId: doctorId });
  }
  async findById(id: string): Promise<IAppoinment | null> {
    return await Appoinment.findById(id);
  }
  async findByPatientId(patientId: string): Promise<IAppoinment[]> {
    return await Appoinment.find({ patientId: patientId });
  }

  async findByIdAndUpdate(
    appoinmentId: string | Types.ObjectId,
    update: Partial<IAppoinment>,
    session?:ClientSession  
  ): Promise<IAppoinment | null> {
    return await Appoinment.findByIdAndUpdate(appoinmentId, update, {
      new: true,
      ...(session && {session})
    });
  }

  async findAppoinmentsByDoctor(
    doctorId: string,
    skip: number,
    limit: number,
    filter?: FilterQuery<IAppoinment>
  ): Promise<(IAppoinment & { patientId: IPatientPopulated;transactionId: ITransactionPopulated })[]> {
    const appointments = await Appoinment.find({ doctorId, ...filter })
      .populate('patientId', '_id name email phone profile_img')
      .populate('transactionId','_id paymentMethod')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return appointments as unknown as (IAppoinment & {
      patientId: IPatientPopulated;
      transactionId: ITransactionPopulated
    })[];
  }
  async findAppoinmentsByPatient(
    patientId: string,
    skip: number,
    limit: number
  ): Promise<(IAppoinment & { doctorId: IDoctorPopulated })[]> {
    const appoinments = await Appoinment.find({ patientId: patientId })
      .populate(
        'doctorId',
        '_id name email phone profile_img qualifications.fees qualifications.specialization'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return appoinments as unknown as (IAppoinment & {
      doctorId: IDoctorPopulated;
    })[];
  }

  async findAll(
    filter: FilterQuery<IAppoinment>,
    skip:number,
    limit:number
  ): Promise<AppoinmentPopulatedDTO[]> {
    const appoinment = await Appoinment.find(filter)
      .populate(
        'doctorId',
        '_id name email phone profile_img qualifications.fees qualifications.specialization'
      )
      .populate('patientId', '_id name email phone profile_img')
      .sort({createdAt:-1})
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return appoinment as unknown as AppoinmentPopulatedDTO[];
  }

  async countPatientAppoinment(patientId: string): Promise<number> {
    return await Appoinment.countDocuments({ patientId: patientId });
  }
  async countDoctorAppoinment(doctorId: string): Promise<number> {
    return await Appoinment.countDocuments({ doctorId: doctorId });
  }

  async findByOneSlot(
    doctorId: string,
    slotDate: string,
    startTime: string,
    session?:ClientSession
  ): Promise<IAppoinment | null> {
    return Appoinment.findOne({
      doctorId,
      'slot.date': slotDate,
      'slot.startTime': startTime,
      status: { $in: ['pending', 'confirmed', 'rescheduled'] },
    }).session(session ?? null);
  }

  async findPatientActiveAppoinments(
    patientId: string,
    doctorId: string
  ): Promise<IAppoinment[]> {
    return await Appoinment.find({
      patientId,
      doctorId,
      status: { $ne: 'cancelled' },
    });
  }
  async adminDashboardData(filter:FilterQuery<IAppoinment>): Promise<DashboardData> {
    const result = await Appoinment.aggregate([
      {$match:filter},
      {
        $facet: {
          statusSummary: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                name: '$_id',
                value: '$count',
              },
            },
          ],

          monthlyTrend: [
            {
              $group: {
                _id: { month: { $month: '$createdAt' } },
                bookings: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
                },
                cancelled: {
                  $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
                },
                pendings:{
                  $sum:{$cond:[{$eq:['$status','pending']},1,0]},
                },
            totalEarnings: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['completed', 'pending']] },
                  { $toDouble: '$amount' }, 
                  0,
                ],
              },
            },
              },
            },
            {
              $project: {
                _id: 0,
                month: {
                  $arrayElemAt: [
                    [
                      '',
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dec',
                    ],
                    '$_id.month',
                  ],
                },
                bookings: 1,
                completed: 1,
                cancelled: 1,
                pendings:1,
                totalEarnings:1
              },
            },
            { $sort: { month: 1 } },
          ],
        },
      },
    ]);
    return result[0] as DashboardData;
  }
  async doctorDashboardData(doctorId: string,filter?:FilterQuery<IAppoinment>): Promise<DoctorDashboardData> {

const result = await Appoinment.aggregate([
  {
    $match: {
      doctorId:doctorId,
      ...filter
    },
  },
  {
    $facet: {
      
      statusSummary: [
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: '$count',
          },
        },
      ],
      monthlyTrend: [
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            bookings: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
            },
            pendings: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
            },
            totalEarnings: {
              $sum: {
                $cond: [
                  { $in: ['$status', ['completed', 'pending']] },
                  { $toDouble: '$amount' },
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $arrayElemAt: [
                [
                  '',
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                '$_id.month',
              ],
            },
            bookings: 1,
            completed: 1,
            cancelled: 1,
            pendings: 1,
            totalEarnings: 1,
          },
        },
        { $sort: { '_id.month': 1 } },
      ],
    },
  },
]);

    return result[0];
  }

  async countAll(filter?: FilterQuery<IAppoinment>): Promise<number> {
    return await Appoinment.countDocuments(filter);
  }

async findTopAppoinments(doctorId: string): Promise<TopTenAppointmentsDTO[]> {
  const result = await Appoinment.aggregate([
    {
      $match: {
        doctorId: new Types.ObjectId(doctorId),
        status: 'completed' 
      }
    },

    // IMPORTANT: Sort before grouping (so $last works correctly)
    { 
      $sort: { createdAt: -1 } 
    },

    {
      $group: {
        _id: '$patientId',
        count: { $sum: 1 },
        latestAppointment: { $first: '$slot' }  // latest slot
      }
    },

    {
      $lookup: {
        from: 'patients',
        localField: '_id',
        foreignField: '_id',
        as: 'patient'
      }
    },

    { $unwind: '$patient' },

    {
      $project: {
        _id: 0,
        patientId: '$_id',
        name: '$patient.name',
        email: '$patient.email',
        count: 1,
        status: 'completed',
        lastAppointmentDate: '$latestAppointment.date',
        startTime: '$latestAppointment.startTime',
        endTime: '$latestAppointment.endTime'
      }
    },

    { $sort: { count: -1 } },

    { $limit: 10 }
  ]);

  return result;
}
}
