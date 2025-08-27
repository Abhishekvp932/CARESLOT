import express from 'express';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PatientController } from '../controllers/patients/patients.controller';
import { PatientService } from '../services/patients/patients.service';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { multiFileUpload } from '../middleware/multer.middleware';
import { SlotRepository } from '../repositories/Slots/slot.repository';
import { AppoinmentRepository } from '../repositories/appoinment/appoinment.repository';

const appoinmentRepo = new AppoinmentRepository();
const patientRepo = new PatientRepository();
const doctorRepo = new DoctorAuthRepository();
const slotRepo = new SlotRepository();
const patientService = new PatientService(patientRepo,doctorRepo,slotRepo,appoinmentRepo);
const patientController = new PatientController(patientService);
const authMiddleware = new AuthMiddleware(patientRepo,doctorRepo);
const router = express.Router();


router.route('/resend-appoinment/:patientId').get(authMiddleware.protect,authMiddleware.isBlockedOrNot,patientController.getResendAppoinment.bind(patientController));


router.route('/profile/:id').put(authMiddleware.protect,authMiddleware.isBlockedOrNot,multiFileUpload,patientController.updateUserProfile.bind(patientController))
.get(authMiddleware.protect,authMiddleware.isBlockedOrNot,patientController.getUserData.bind(patientController));


router.route('/doctors')
.get(authMiddleware.isBlockedOrNot,patientController.getAllDoctors.bind(patientController));

router.route('/doctor/:id').
get(authMiddleware.isBlockedOrNot,patientController.getDoctorDetails.bind(patientController));


router.route('/slots/:id')
.get(authMiddleware.isBlockedOrNot,patientController.getDoctorSlots.bind(patientController));

router.route('/specializations')
.get(authMiddleware.isBlockedOrNot,patientController.getAllspecializations.bind(patientController));

router.route('/checkout/:id').
get(authMiddleware.protect,authMiddleware.isBlockedOrNot,patientController.getDoctorAndSlot.bind(patientController));

router.route('/related-doctors')
.get(authMiddleware.protect,authMiddleware.isBlockedOrNot,patientController.getRelatedDoctor.bind(patientController));


router.route('/change-password/:id')
.patch(authMiddleware.protect,authMiddleware.isBlockedOrNot,patientController.changePassword.bind(patientController));
export default router;