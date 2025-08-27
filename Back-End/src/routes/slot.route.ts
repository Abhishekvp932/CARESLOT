import { SlotService } from '../services/Slots/slot.service';
import { SlotController } from '../controllers/Slots/slot.controller';
import express from 'express';
import { SlotRepository } from '../repositories/Slots/slot.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { PatientRepository } from '../repositories/auth/auth.repository';
const doctorRepo = new DoctorAuthRepository();
const slotRepo = new SlotRepository();
const patientRepo = new PatientRepository();
const slotService = new SlotService(slotRepo,doctorRepo);
const slotController = new SlotController(slotService);
const authMiddleware = new AuthMiddleware(patientRepo,doctorRepo);

const router = express.Router();

router.route('/slots')
.post(authMiddleware.protect,slotController.addTimeSlot.bind(slotController));


router.route('/slots/:id')
.get(authMiddleware.protect,slotController.getDoctorSlot.bind(slotController))
.delete(authMiddleware.protect,slotController.deleteSlot.bind(slotController));
export default router;

