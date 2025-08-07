import express from 'express';
import { DoctorController } from '../controllers/doctors/doctor.controller';
import { DoctorService } from '../services/doctor/doctor.service';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorRepository } from '../repositories/doctors/doctor.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { multiFileUpload } from '../middleware/multer.middleware';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

const patientRepo = new PatientRepository();
const doctorRepo = new DoctorRepository();
const doctorAuthRepo = new DoctorAuthRepository();
const doctorService = new DoctorService(doctorRepo, patientRepo, doctorAuthRepo);

const doctorController = new DoctorController(doctorService);

router.post('/kycSubmit/:id', multiFileUpload, doctorController.uploadDocuments.bind(doctorController));
router.route('/profile/:id')
.get(protect,doctorController.getDoctorProfile.bind(doctorController))
.put(protect,multiFileUpload,doctorController.editDoctorProfile.bind(doctorController));
export default router