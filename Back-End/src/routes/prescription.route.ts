import express from 'express';

import { PrescriptionController } from '../controllers/prescription/prescription.controller';
import { Routers } from '../utils/Routers';
import { PrescriptionService } from '../services/prescription/prescription.service';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { AppoinmentRepository } from '../repositories/appoinment/appoinment.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { PrescriptionRepository } from '../repositories/prescription/prescription.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
const router = express.Router();
const appoinmentRepository = new AppoinmentRepository();
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorAuthRepository();
const prescriptionRepository = new PrescriptionRepository();
const prescriptionService = new PrescriptionService(
  doctorRepository,
  appoinmentRepository,
  patientRepository,
  prescriptionRepository
);
const prescriptionController = new PrescriptionController(prescriptionService);

const authMiddleware = new AuthMiddleware(patientRepository, doctorRepository);

router
  .route(Routers.prescriptionRouters.create)
  .post(
    authMiddleware.protect,
    authMiddleware.isBlockedOrNot,
    authMiddleware.authorizeRole('doctors'),
    prescriptionController.addPrescription.bind(prescriptionController)
  );

router
  .route(Routers.prescriptionRouters.download)
  .get(
    prescriptionController.downloadPrescription.bind(prescriptionController)
  );
export default router;
