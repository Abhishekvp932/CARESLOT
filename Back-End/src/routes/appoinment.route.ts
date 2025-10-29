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
import { ChatRepository } from '../repositories/chat/chat.repository';
import { CallLogRepository } from '../repositories/callLogs/callLog.repository';
const doctorRepository = new DoctorAuthRepository();
const appoinmentRepository = new AppoinmentRepository();
const notificationRepository = new NotificationRepository();
const patientRepository = new PatientRepository();
const walletRepository = new WalletRepository();
const walletHistoryRepository = new WalletHistoryRepository();
const chatRepository = new ChatRepository();
const callLogRepository = new CallLogRepository();
const appoinmentService = new AppoinmentService(
  appoinmentRepository,
  patientRepository,
  doctorRepository,
  notificationRepository,
  walletRepository,
  walletHistoryRepository,
  chatRepository,
  callLogRepository,
);
const appoinmentController = new AppoinmentController(appoinmentService);
const authMiddleware = new AuthMiddleware(patientRepository, doctorRepository);
const router = express.Router();

router
  .route(Routers.appoinmentRouters.appoinments)
  .post(
    authMiddleware.protect,
    authMiddleware.isBlockedOrNot,
    authMiddleware.authorizeRole('patients'),
    appoinmentController.createAppoinment.bind(appoinmentController)
  );

router
  .route(Routers.appoinmentRouters.appoinmentCancel)
  .patch(
    authMiddleware.isBlockedOrNot,
    authMiddleware.protect,
    appoinmentController.cancelAppoinment.bind(appoinmentController)
  );

router.route(Routers.appoinmentRouters.changeStatus)
.patch(authMiddleware.isBlockedOrNot,authMiddleware.isBlockedOrNot,authMiddleware.authorizeRole('doctors'),appoinmentController.changeAppoinmentStatus.bind(appoinmentController));
export default router;
