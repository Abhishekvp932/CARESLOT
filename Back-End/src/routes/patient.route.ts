import express from "express";
import { PatientRepository } from "../repositories/auth/auth.repository";
import { protect } from "../middleware/auth.middleware";
import { PatientController } from "../controllers/patients/patients.controller";
import { PatientService } from "../services/patients/patients.service";
import { DoctorAuthRepository } from "../repositories/doctors/doctor.auth.repository";
import { multiFileUpload } from '../middleware/multer.middleware';
import { SlotRepository } from "../repositories/Slots/slot.repository";
const patientRepo = new PatientRepository()
const doctorRepo = new DoctorAuthRepository()
const slotRepo = new SlotRepository()
const patientService = new PatientService(patientRepo,doctorRepo,slotRepo);
const patientController = new PatientController(patientService);

const router = express.Router();


router.route('/profile').get(protect,patientController.getResendAppoinment.bind(patientController));
router.route('/profile/:id').put(protect,multiFileUpload,patientController.updateUserProfile.bind(patientController))
.get(protect,patientController.getUserData.bind(patientController));


router.route('/doctors')
.get(protect,patientController.getAllDoctors.bind(patientController));

router.route('/doctor/:id').
get(protect,patientController.getDoctorDetails.bind(patientController));


router.route('/slots/:id')
.get(protect,patientController.getDoctorSlots.bind(patientController));

router.route('/specializations')
.get(protect,patientController.getAllspecializations.bind(patientController));
export default router;