import { SlotService } from "../services/Slots/slot.service";
import { SlotController } from "../controllers/Slots/slot.controller";
import express from 'express'
import { SlotRepository } from "../repositories/Slots/slot.repository";
import { protect } from "../middleware/auth.middleware";
import { DoctorAuthRepository } from "../repositories/doctors/doctor.auth.repository";
const doctorRepo = new DoctorAuthRepository()
const slotRepo = new SlotRepository()
const slotService = new SlotService(slotRepo,doctorRepo);
const slotController = new SlotController(slotService);


const router = express.Router();

router.route('/slots')
.post(protect,slotController.addTimeSlot.bind(slotController));


router.route('/slots/:id')
.get(protect,slotController.getDoctorSlot.bind(slotController))
.delete(protect,slotController.deleteSlot.bind(slotController));
export default router

