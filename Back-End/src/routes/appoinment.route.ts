import { AppoinmentService } from '../services/appoinment/appoinment.service';
import { AppoinmentController } from '../controllers/appoinment/appoinment.controller';
import { AppoinmentRepository } from '../repositories/appoinment/appoinment.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { NotificationRepository } from '../repositories/notification/notification.repository';
import { Routers } from '../utils/Routers';
import express from 'express';
import { WalletHistoryRepository } from '../repositories/walletHistory/wallet.history';
import { WalletRepository } from '../repositories/wallet/wallet.repository';

const doctorRepo = new DoctorAuthRepository();
const appoinmentRepo = new AppoinmentRepository();
const notificationRepository = new NotificationRepository();
const patientRepo = new PatientRepository();
const walletRepository = new WalletRepository();
const walletHistoryRepository = new WalletHistoryRepository();
const appoinmentService = new AppoinmentService(
  appoinmentRepo,
  patientRepo,
  doctorRepo,
  notificationRepository,
  walletRepository,
  walletHistoryRepository,
);
const appoinmentController = new AppoinmentController(appoinmentService);
const authMiddleware = new AuthMiddleware(patientRepo, doctorRepo);
const router = express.Router();

router
  .route(Routers.appoinmentRouters.appoinments)
  .post(appoinmentController.createAppoinment.bind(appoinmentController));

  router.route(Routers.appoinmentRouters.appoinmentCancel)
  .patch(authMiddleware.isBlockedOrNot,authMiddleware.protect,appoinmentController.cancelAppoinment.bind(appoinmentController));
export default router;
