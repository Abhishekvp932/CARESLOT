import express from 'express';
import { DoctorController } from '../controllers/doctors/doctor.controller';
import { DoctorService } from '../services/doctor/doctor.service';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { multiFileUpload } from '../middleware/multer.middleware';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

const patientRepo = new PatientRepository();
const doctorAuthRepo = new DoctorAuthRepository();
const doctorService = new DoctorService(patientRepo, doctorAuthRepo);

const doctorController = new DoctorController(doctorService);
const authMiddleware = new AuthMiddleware(patientRepo,doctorAuthRepo);
router.post('/kycSubmit/:id', multiFileUpload, doctorController.uploadDocuments.bind(doctorController));
router.route('/profile/:id')
.get(authMiddleware.protect,doctorController.getDoctorProfile.bind(doctorController))
.put(authMiddleware.protect,multiFileUpload,doctorController.editDoctorProfile.bind(doctorController));

router.route('/reApply/:doctorId')
.put(authMiddleware.protect,multiFileUpload,doctorController.reApplyDoctor.bind(doctorController));
export default router;