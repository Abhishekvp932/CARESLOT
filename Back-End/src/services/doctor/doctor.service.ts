import { SERVICE_MESSAGE } from '../../utils/ServiceMessage';
import {
  IDoctor,
  QualificationInput,
} from '../../interface/doctor/doctor.service.interface';

import { MailService } from '../mail.service';
import { DoctorProfileInput } from '../../types/doctor';
import { UploadedFiles } from '../../types/doctor';

import { IpatientRepository } from '../../interface/auth/auth.interface';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import { IDoctor as IDoctorData } from '../../models/interface/IDoctor';

import { doctorDetails } from '../../types/doctorDetails';

import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import logger from '../../utils/logger';
import { AppointmentPatientDTO } from '../../types/AppointsAndPatientsDto';

export class DoctorService implements IDoctor {
  constructor(
    private _patientRepository: IpatientRepository,
    private _authDoctorRepository: IDoctorAuthRepository,
    private _appoinmentRepository: IAppoinmentRepository
  ) {}
  async uploadDocument(
    doctorId: string,
    input: QualificationInput,
    profileImage: string
  ): Promise<{ msg: string }> {
    const doctor = await this._authDoctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.USER_NOT_FOUND);
    }

    await this._authDoctorRepository.uploadDocument(doctorId, {
      profile_img: profileImage,
      qualifications: input,
    });
    const mailService = new MailService();

    await mailService.sendMail(
      doctor.email,
      'Your KYC Documents Have Been Received – CareSlot',
      `Dear Dr. ${doctor.name},

Thank you for submitting your KYC documents to CareSlot. 🩺  
We’ve successfully received your qualification and experience certificates.

Our admin team will now review your documents.  
You’ll be notified once your profile is approved and activated.

✅ Submission Date: ${new Date().toLocaleDateString()}

If you have any questions, feel free to contact our support team careslot@gmail.com.

Best regards,  
The CareSlot Team`
    );

    return { msg: 'Document uploaded successfully' };
  }

  async getDoctorProfile(
    doctorId: string
  ): Promise<{ msg: string; doctor: doctorDetails }> {
    const doctors = await this._authDoctorRepository.findById(doctorId);

    if (!doctors) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const doctor: doctorDetails = {
      _id: String(doctors._id),
      email: doctors.email,
      isBlocked: doctors.isBlocked ?? undefined,
      isApproved: doctors.isApproved ?? undefined,
      name: doctors.name,
      phone: doctors.phone,
      DOB: doctors.DOB ? new Date(doctors.DOB) : undefined,
      gender: doctors.gender ?? undefined,
      isRejected: doctors.isRejected ?? undefined,
      role: doctors.role ?? 'doctors',
      updatedAt: doctors.updatedAt ? new Date(doctors.updatedAt) : undefined,
      createdAt: doctors.createdAt ? new Date(doctors.createdAt) : undefined,
      profile_img: doctors.profile_img ?? undefined,
      qualifications: {
        degree: doctors.qualifications?.degree ?? undefined,
        institution: doctors.qualifications?.institution ?? undefined,
        experince:
          doctors.qualifications?.experince !== undefined
            ? Number(doctors.qualifications.experince)
            : undefined,
        educationCertificate:
          doctors.qualifications?.educationCertificate ?? undefined,
        experienceCertificate:
          doctors.qualifications?.experienceCertificate ?? undefined,
        graduationYear:
          doctors.qualifications?.graduationYear !== undefined
            ? Number(doctors.qualifications.graduationYear)
            : undefined,
        specialization: doctors.qualifications?.specialization ?? undefined,
        medicalSchool: doctors.qualifications?.medicalSchool ?? undefined,
        about: doctors.qualifications?.about ?? undefined,
        fees:
          doctors.qualifications?.fees !== undefined
            ? Number(doctors.qualifications.fees)
            : undefined,
        lisence: doctors.qualifications?.lisence ?? undefined,
      },
    };
    return { msg: 'doctor Data fetched successfully', doctor };
  }

  async editDoctorProfile(
    doctorId: string,
    body: DoctorProfileInput,
    files: UploadedFiles
  ): Promise<{ msg: string }> {
    const doctor = await this._authDoctorRepository.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');

    const {
      name,
      email,
      phone,
      DOB,
      gender,
      degree,
      institution,
      specialization,
      medicalSchool,
      experince,
      graduationYear,
      fees,
      license,
      about,
    } = body;

    const updatedDoctor: Partial<IDoctorData> = {
      name: name || doctor.name,
      email: email || doctor.email,
      phone: phone || doctor.phone,
      DOB: DOB ? new Date(DOB) : doctor.DOB,
      gender: gender || doctor.gender,
      profile_img: files?.profileImage?.[0]?.path || doctor.profile_img,
      qualifications: {
        degree: degree ?? doctor.qualifications?.degree ?? '',
        institution: institution ?? doctor.qualifications?.institution ?? '',
        specialization:
          specialization ?? doctor.qualifications?.specialization ?? '',
        medicalSchool:
          medicalSchool ?? doctor.qualifications?.medicalSchool ?? '',
        experince: experince
          ? Number(experince)
          : doctor.qualifications?.experince ?? 0,
        graduationYear: graduationYear
          ? Number(graduationYear)
          : doctor.qualifications?.graduationYear ?? 0,
        fees: fees ?? doctor.qualifications?.fees ?? '',
        lisence: license ?? doctor.qualifications?.lisence ?? '',
        about: about ?? doctor.qualifications?.about ?? '',
        educationCertificate:
          files?.educationCertificate?.[0]?.path ??
          doctor.qualifications?.educationCertificate ??
          '',
        experienceCertificate:
          files?.experienceCertificate?.[0]?.path ??
          doctor.qualifications?.experienceCertificate ??
          '',
      },
    };

    await this._authDoctorRepository.updateById(doctorId, updatedDoctor);
    return { msg: 'Profile updated' };
  }

  async reApplyDoctor(
    doctorId: string,
    body: DoctorProfileInput,
    files: UploadedFiles
  ): Promise<{ msg: string }> {
    const doctor = await this._authDoctorRepository.findById(doctorId);
    if (!doctor) throw new Error('Doctor not found');

    const {
      name,
      email,
      phone,
      DOB,
      gender,
      degree,
      institution,
      specialization,
      medicalSchool,
      experince,
      graduationYear,
      fees,
      license,
      about,
    } = body;

    const updatedDoctor: Partial<IDoctorData> = {
      name: name || doctor.name,
      email: email || doctor.email,
      phone: phone || doctor.phone,
      DOB: DOB ? new Date(DOB) : doctor.DOB,
      isRejected: false,
      gender: gender || doctor.gender,
      profile_img: files?.profileImage?.[0]?.path || doctor.profile_img,
      qualifications: {
        degree: degree ?? doctor.qualifications?.degree ?? '',
        institution: institution ?? doctor.qualifications?.institution ?? '',
        specialization:
          specialization ?? doctor.qualifications?.specialization ?? '',
        medicalSchool:
          medicalSchool ?? doctor.qualifications?.medicalSchool ?? '',
        experince: experince
          ? Number(experince)
          : doctor.qualifications?.experince ?? 0,
        graduationYear: graduationYear
          ? Number(graduationYear)
          : doctor.qualifications?.graduationYear ?? 0,
        fees: fees ?? doctor.qualifications?.fees ?? '',
        lisence: license ?? doctor.qualifications?.lisence ?? '',
        about: about ?? doctor.qualifications?.about ?? '',
        educationCertificate:
          files?.educationCertificate?.[0]?.path ??
          doctor.qualifications?.educationCertificate ??
          '',
        experienceCertificate:
          files?.experienceCertificate?.[0]?.path ??
          doctor.qualifications?.experienceCertificate ??
          '',
      },
    };

    await this._authDoctorRepository.updateById(doctorId, updatedDoctor);

    const response = { msg: 'Doctor re-applied successfully' };
    async () => {
      try {
        const mailService = new MailService();

        await mailService.sendMail(
          doctor.email,
          'Your Re-Application Has Been Submitted – CareSlot',
          `Dear Dr. ${doctor.name},

    Thank you for re-applying with CareSlot. 🩺  
    We’ve successfully received your updated profile details and supporting documents.

    Our admin team will carefully review the changes you’ve provided.  
    You’ll be notified by email once your re-application has been verified and your profile status is updated.

    📅 Re-Application Date: ${new Date().toLocaleDateString()}

    If you have any questions or need assistance, please reach out to us at careslot@gmail.com.  
    We’re here to support you every step of the way.

    Best regards,  
    The CareSlot Team`
        );
      } catch (error: any) {
        throw new Error(error);
      }
    };

    return response;
  }
  async getAllAppoinments(doctorId: string): Promise<AppointmentPatientDTO[]> {
    const doctor = await this._authDoctorRepository.findById(doctorId);

    if (!doctor) {
      throw new Error(SERVICE_MESSAGE.DOCTOR_NOT_FOUND);
    }
    const appoinmentWithPatients =
      await this._appoinmentRepository.findAppoinmentsByDoctor(
        doctor?._id as string
      );
    // logger.debug(appoinmentWithPatients);

    const appointments: AppointmentPatientDTO[] = appoinmentWithPatients.map(
      (app) => ({
        _id: app._id as string,
        doctorId: app.doctorId.toString(),
        transactionId: app.transactionId?.toString(),
        amount: app.amount,
        status: app.status,
        slot: {
          date: app.slot.date,
          startTime: app.slot.startTime,
          endTime: app.slot.endTime,
        },
        patientId: {
          _id: app.patientId._id.toString(),
          name: app.patientId.name,
          email: app.patientId.email,
          phone: app.patientId.phone,
          profile_img: app.patientId.profile_img,
        },
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
      })
    );
    logger.debug(appointments);
    return appointments;
  }
}
