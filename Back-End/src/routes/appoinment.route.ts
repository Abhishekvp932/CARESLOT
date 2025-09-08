import { AppoinmentService } from '../services/appoinment/appoinment.service';
import { AppoinmentController } from '../controllers/appoinment/appoinment.controller';
import { AppoinmentRepository } from '../repositories/appoinment/appoinment.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { NotificationRepository } from '../repositories/notification/notification.repository';
import express from 'express';
const doctorRepo = new DoctorAuthRepository();
const appoinmentRepo = new AppoinmentRepository();
const notificationRepository = new NotificationRepository();
const patientRepo = new PatientRepository();
const appoinmentService = new AppoinmentService(appoinmentRepo,patientRepo,doctorRepo,notificationRepository);
const appoinmentController = new AppoinmentController(appoinmentService);
const authMiddleware = new AuthMiddleware(patientRepo,doctorRepo);
const router = express.Router();


router.route('/appoinment')
.post(appoinmentController.createAppoinment.bind(appoinmentController));



export default router;


