import express from 'express';
import { DoctorController } from '../controllers/doctors/doctor.controller';
import { DoctorService } from '../services/doctor/doctor.service';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorRepository } from '../repositories/doctors/doctor.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { multiFileUpload } from '../middleware/multer.middleware';

const router = express.Router();

const patientRepo = new PatientRepository();
const doctorRepo = new DoctorRepository();
const doctorAuthRepo = new DoctorAuthRepository();
const doctorService = new DoctorService(doctorRepo, patientRepo, doctorAuthRepo);

const doctorController = new DoctorController(doctorService);

router.post('/kycSubmit/:id', multiFileUpload, doctorController.uploadDocuments.bind(doctorController));

export default router