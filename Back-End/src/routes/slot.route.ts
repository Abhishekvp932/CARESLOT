import { SlotService } from '../services/Slots/slot.service';
import { SlotController } from '../controllers/Slots/slot.controller';
import express from 'express';
import { SlotRepository } from '../repositories/Slots/slot.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { Routers } from '../utils/Routers';
const doctorRepository = new DoctorAuthRepository();
const slotRepository = new SlotRepository();
const patientRepository = new PatientRepository();
const slotService = new SlotService(slotRepository, doctorRepository);
const slotController = new SlotController(slotService);
const authMiddleware = new AuthMiddleware(patientRepository, doctorRepository);

const router = express.Router();

router
  .route(Routers.slotRouters.slots)
  .post(
    authMiddleware.protect,
    slotController.addTimeSlot.bind(slotController)
  );

router
  .route(Routers.slotRouters.slotWithSlotId)
  .get(
    authMiddleware.protect,
    slotController.getDoctorSlot.bind(slotController)
  )
  .delete(
    authMiddleware.protect,
    slotController.deleteSlot.bind(slotController)
  );
export default router;
