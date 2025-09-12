import express from 'express';

import { PaymentController } from '../controllers/payment/payment.controller';
import { PaymentService } from '../services/payment/payment.service';
import { PaymentRepository } from '../repositories/payment/payment.repository';
import { AppoinmentRepository } from '../repositories/appoinment/appoinment.repository';
import { NotificationRepository } from '../repositories/notification/notification.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { Routers } from '../utils/Routers';
const router = express.Router();
const paymentRepository = new PaymentRepository();
const appoinmentRepository = new AppoinmentRepository();
const notificationRepository = new NotificationRepository();
const doctorRepository = new DoctorAuthRepository();
const patientRepository = new PatientRepository();
const paymentService = new PaymentService(
  paymentRepository,
  appoinmentRepository,
  notificationRepository,
  doctorRepository,
  patientRepository
);
const paymentController = new PaymentController(paymentService);

router
  .route(Routers.paymentRouters.order)
  .post(paymentController.createOrder.bind(paymentController));
router
  .route(Routers.paymentRouters.verifyOrder)
  .post(paymentController.verifyOrder.bind(paymentController));

export default router;
