import { IPatientService } from '../../interface/patients/IPatientService';

import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';

import { IDoctorAuthRepository } from '../../interface/doctor/IDoctorRepository';
import { IpatientRepository } from '../../interface/auth/IAuthInterface';
import { IDoctor } from '../../models/interface/IDoctor';

import { ISlotRepository } from '../../interface/Slots/ISlotRepository';
import { DoctorDTO } from '../../types/doctor.dto';
import { DoctorListResult } from '../../types/doctorListResult';
import { SpecializationsList } from '../../types/specializationsList';
import logger from '../../utils/logger';
import { hashPassword, comparePassword } from '../../utils/hash';
import { doctorDetails } from '../../types/doctorDetails';
import { UserDTO } from '../../types/user.dto';
import { getNextDateOfWeek } from '../../utils/getDayOfWeek';
import { genarateSlots } from '../../utils/SlotUtlity';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';

import { AppointmentDoctorDTO } from '../../types/AppoinmentsAndDoctorDto';
import { IPatient } from '../../models/interface/IPatient';
import { IBookedSlot, IDoctorSlotDoc, IDoctorSlotTime, IGeneratedSlot } from '../../types/SlotTypesDTO';
import { IAppoinmentDto } from '../../types/IAppoinmentDTO';
export class PatientService implements IPatientService {
  constructor(
    private _patientRepository: IpatientRepository,
    private _doctorRepository: IDoctorAuthRepository,
    private _slotsRepository: ISlotRepository,
    private _appoinmentRepository: IAppoinmentRepository
  ) {}

  async getResendAppoinments(
    patientId: string
  ): Promise<{
    msg: string;
    doctors: DoctorDTO[];
    appoinments: IAppoinmentDto[];
  }> {
    const appoinments = await this._appoinmentRepository.findByPatientId(patientId);

    if (!appoinments) {
      throw new Error('Appoinment not found');
    }
    const doctorIds = appoinments.map((app) => app.doctorId);
    const uniqueIds = [...new Set(doctorIds)];
    const doctorsList = await this._doctorRepository.findAppoinmentDoctors({
      _id: { $in: uniqueIds },
    });

    if (!doctorsList) {
      throw new Error('No doctors found');
    }

    const doctors: DoctorDTO[] = doctorsList.map((doctor: IDoctor) => ({
      _id: String(doctor?._id),
      email: doctor?.email,
      isBlocked: doctor?.isBlocked,
      isApproved: doctor?.isApproved,
      name: doctor?.name,
      DOB: doctor?.DOB,
      gender: doctor?.gender,
      role: doctor?.role,
      updatedAt: doctor?.updatedAt,
      createdAt: doctor?.createdAt,
      profile_img: doctor?.profile_img,
      qualifications: {
        degree: doctor?.qualifications?.degree,
        institution: doctor?.qualifications?.institution,
        experince:
          doctor?.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate: doctor?.qualifications?.educationCertificate,
        experienceCertificate: doctor?.qualifications?.experienceCertificate,
        graduationYear:
          doctor?.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor?.qualifications?.specialization,
        medicalSchool: doctor?.qualifications?.medicalSchool,
        about: doctor?.qualifications?.about,
        fees:
          doctor?.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor?.qualifications?.lisence,
      },
    }));

    return { msg: 'data fetched', doctors, appoinments };
  }
  async updateUserProfile(
    formData: Partial<IPatient>,
    userId: string,
    profileImg?: string
  ): Promise<{ msg: string }> {
    const user = await this._patientRepository.findById(userId);

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    await this._patientRepository.updateById(userId, {
      ...formData,
      profile_img: profileImg,
    });

    return { msg: 'profile updated successfully' };
  }
  async getUserData(userId: string): Promise<{ msg: string; users: UserDTO }> {
    const user = await this._patientRepository.findById(userId);

    if (!user) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }
    const users = {
      _id: String(user?._id),
      email: user?.email,
      name: user?.name,
      phone: user?.phone,
      gender: user?.gender,
      DOB: user?.DOB,
      isBlocked: user?.isBlocked,
      role: user?.role,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      profile_img: user?.profile_img,
    };
    return { msg: 'user data fetched successfully', users };
  }

  async getAllDoctors(
    page: number,
    limit: number,
    search: string,
    specialty: string,
    sortBy:string
  ): Promise<DoctorListResult> {
    const skip = (page - 1) * limit;
    const searchFilter = {
      isApproved: true,
      isBlocked:false,
      ...(search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              {
                'qualifications.specialization': {
                  $regex: search,
                  $options: 'i',
                },
              },
            ],
          }
        : {}),
      ...(specialty && specialty !== 'All Specialties'
        ? { 'qualifications.specialization': specialty }
        : {}),
    };
        let sortCondition: Record<string, 1 | -1> = {};
        switch (sortBy){
          case 'rating':
            sortCondition = {avgRating:-1};
            break;
            case 'experience':
             sortCondition = { 'qualifications.experince': -1 };
             break;
             case 'fee':
              sortCondition = { 'qualifications.fees': 1 };
              break;
              default:
                sortCondition = {createdAt:-1};
                break;
        }
    const [doctorList, total] = await Promise.all([
      this._doctorRepository.findAllWithPagination(skip, limit, searchFilter,sortCondition),
      this._doctorRepository.countAll(searchFilter),
    ]);

    if (!doctorList) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const doctors: DoctorDTO[] = doctorList.map((doctor) => ({
      _id: String(doctor?._id),
      name: doctor?.name,
      updatedAt: doctor?.updatedAt,
      createdAt: doctor?.createdAt,
      profile_img: doctor?.profile_img,
      qualifications: {
        degree: doctor?.qualifications?.degree,
        institution: doctor?.qualifications?.institution,
        experince:
          doctor?.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        specialization: doctor?.qualifications?.specialization,
        medicalSchool: doctor?.qualifications?.medicalSchool,
        fees:
          doctor?.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
      },
      totalRating:doctor?.totalRating,
      avgRating:doctor?.avgRating
    }));

    return { doctors, total };
  }

  async getDoctorDetails(doctorId: string): Promise<doctorDetails> {
    const doctors = await this._doctorRepository.findById(doctorId);

    if (!doctors) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

    const doctor: doctorDetails = {
      _id: String(doctors._id),
      name: doctors.name,
      profile_img: doctors.profile_img ?? undefined,
      qualifications: {
        degree: doctors.qualifications?.degree ?? undefined,
        experince: doctors.qualifications?.experince ?? undefined,
        specialization: doctors.qualifications?.specialization ?? undefined,
        about: doctors.qualifications?.about ?? undefined,
        fees:
          doctors.qualifications?.fees !== undefined
            ? Number(doctors.qualifications.fees)
            : undefined,
      },
      totalRating:doctors.totalRating,
      avgRating:doctors.avgRating,
    };

    return doctor;
  }

  async getDoctorSlots(
    doctorId: string,
    targetDate: string
  ): Promise<IGeneratedSlot[]> {
    const doctor = await this._doctorRepository.findById(doctorId);
    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
   

    logger.info('suttu');

    const doctorSlots = await this._slotsRepository.findByDoctorId(doctorId);
    const slots: IGeneratedSlot[] = [];

    const doctorAppoinments = await this._appoinmentRepository.findByDoctorId(
      doctorId
    );

    const bookedSlot:IBookedSlot[] = doctorAppoinments.map((appt) => ({
      date: appt?.slot?.date,
      startTime: appt?.slot?.startTime,
      endTime: appt?.slot?.endTime,
      status:appt?.status
    }));

     logger.debug(bookedSlot);
    const today = targetDate ? new Date(targetDate) : new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);

    // endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    doctorSlots?.forEach((slotDoc:IDoctorSlotDoc) => {
      slotDoc?.slotTimes.forEach((slot:IDoctorSlotTime) => {
        const dayDate = getNextDateOfWeek(slot?.daysOfWeek);

        // if(targetDay < new Date()) return;

        if (!dayDate || dayDate < today || dayDate > endOfWeek) return;

        const startTime = new Date(dayDate);
        startTime.setHours(
          slot.startTime.getHours(),
          slot.startTime.getMinutes(),
          0,
          0
        );

        const endTime = new Date(dayDate);
        endTime.setHours(
          slot.endTime.getHours(),
          slot.endTime.getMinutes(),
          0,
          0
        );

        const breaks = (slot.breakTime || []).map((b) => {
          const brStart = new Date(dayDate);
          brStart.setHours(
            b.startTime.getHours(),
            b.startTime.getMinutes(),
            0,
            0
          );

          const brEnd = new Date(dayDate);
          brEnd.setHours(b.endTime.getHours(), b.endTime.getMinutes(), 0, 0);

          return { startTime: brStart, endTime: brEnd };
        });
      
        const now = new Date();
        
        const slotsArray = genarateSlots(
          startTime,
          endTime,
          slot.slotDuration,
          breaks
        )
          .filter((s) => s.startTime >= today && s.startTime <= endOfWeek)
          .filter((s) => {
            return !bookedSlot.some(
              (b) =>
                b.date === s.startTime.toISOString().split('T')[0] &&
                b.startTime ===
                  s.startTime.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) &&
                b.endTime ===
                  s.endTime.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) && b.status === 'pending'
            );
          }).filter((s)=>{
            const slotDate = s.startTime;
            if(slotDate.toDateString() === now.toDateString()){
              return slotDate >= now;
            }
            return true;
          })
          .map((s) => ({
            startTime: s.startTime.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            endTime: s.endTime.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            status: s.status,
            dayOfWeek: slot.daysOfWeek,
            doctorId: doctorId,
            date: startTime.toISOString().split('T')[0],
          }));

        slots.push(...slotsArray);
      });
    });

    logger.debug(slots);

    return slots;
  }

  async getAllspecializations(): Promise<SpecializationsList> {
    const doctorList: IDoctor[] =
      await this._doctorRepository.findAllWithFilter({
        isApproved: true,
      });
    if (!doctorList) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const specializations: string[] = Array.from(
      new Set<string>(
        doctorList
          .map((doc: IDoctor) => doc?.qualifications?.specialization)
          .filter((spec: string | undefined): spec is string => Boolean(spec))
      )
    );

    return { specializations };
  }
  async getDoctorAndSlot(
    doctorId: string
  ): Promise<{ doctor: doctorDetails | null }> {
    const doctor = await this._doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }

    const doctors: doctorDetails = {
      _id: String(doctor._id),
      email: doctor.email,
      name: doctor.name,
      profile_img: doctor.profile_img ?? undefined,
      qualifications: {
        degree: doctor.qualifications?.degree ?? undefined,
        experince:
          doctor.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        specialization: doctor.qualifications?.specialization ?? undefined,
        about: doctor.qualifications?.about ?? undefined,
        fees:
          doctor.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
      },
    };

    return { doctor: doctors };
  }

  async getRelatedDoctor(
    doctorId: string,
    specialization: string
  ): Promise<doctorDetails[]> {
    const doctorsList = await this._doctorRepository.findRelatedDoctors(
      specialization,
      doctorId
    );
    if (!doctorsList) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const doctors = doctorsList.map((doctor) => ({
      _id: String(doctor?._id),
      name: doctor?.name,
      DOB: doctor?.DOB,
      role: doctor?.role,
      profile_img: doctor?.profile_img,
      qualifications: {
        degree: doctor?.qualifications?.degree,
        institution: doctor?.qualifications?.institution,
        experince:
          doctor?.qualifications?.experince !== undefined
            ? Number(doctor.qualifications.experince)
            : undefined,
        educationCertificate: doctor?.qualifications?.educationCertificate,
        experienceCertificate: doctor?.qualifications?.experienceCertificate,
        graduationYear:
          doctor?.qualifications?.graduationYear !== undefined
            ? Number(doctor.qualifications.graduationYear)
            : undefined,
        specialization: doctor?.qualifications?.specialization,
        medicalSchool: doctor?.qualifications?.medicalSchool,
        about: doctor?.qualifications?.about,
        fees:
          doctor?.qualifications?.fees !== undefined
            ? Number(doctor.qualifications.fees)
            : undefined,
        lisence: doctor?.qualifications?.lisence,
      },
    }));

    return doctors;
  }
  async changePassword(
    patientId: string,
    oldPassword: string,
    newPasword: string
  ): Promise<{ msg: string }> {
    const patient = await this._patientRepository.findById(patientId);
    if (!patient) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    const isPassword = await comparePassword(oldPassword, patient?.password);

    if (!isPassword) {
      throw new Error(SERVICE_MESSAGE.OLD_PASSWORD_INCORRECT);
    }
    const hashedPassword = await hashPassword(newPasword);
    await this._patientRepository.updateById(patientId, {
      password: hashedPassword,
    });
    return { msg: 'Password Changed' };
  }

  async getAllAppoinments(patientId: string,page:number,limit:number): Promise<{appoinments:AppointmentDoctorDTO[],total:number}>{
    const skip = (page - 1) * limit;
    if (!patientId) {
      throw new Error('patient id not found');
    }
    const patient = await this._patientRepository.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    const [appoinmentList,total] = await Promise.all([
      this._appoinmentRepository.findAppoinmentsByPatient(
      patient?._id as string,
      skip,
      limit,
    ),
    this._appoinmentRepository.countPatientAppoinment(patientId)
    ]);

    if (!appoinmentList) {
      throw new Error('Appoinments not found');
    }

    const appoinments: AppointmentDoctorDTO[] = appoinmentList.map((app) => {
      return {
        _id: app?._id as string,
        slot: {
          date: app.slot.date,
          startTime: app.slot.startTime,
          endTime: app.slot.endTime,
        },
        patientId: app.patientId.toString(),
        transactionId: app.transactionId?.toString(),
        amount: app.amount,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        doctorId: {
          _id: app.doctorId._id.toString(),
          email: app.doctorId.email,
          name: app.doctorId.name,
          phone: app.doctorId.phone,
          profile_img: app.doctorId.profile_img,
          qualifications: {
            fees: app.doctorId.qualifications?.fees as number,
            specialization: app.doctorId.qualifications?.specialization,
          },
        },
      };
    });

    logger.debug(appoinments);

    return {
      appoinments,
      total
    };
  }
}
