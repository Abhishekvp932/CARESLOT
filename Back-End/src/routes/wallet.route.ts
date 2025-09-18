import express from 'express';
import { WalletRepository } from '../repositories/wallet/wallet.repository';
import { WalletService } from '../services/wallet/wallet.service';
import { WalletController } from '../controllers/wallet/wallet.controller';
import { WalletHistoryRepository } from '../repositories/walletHistory/wallet.history';
import { Routers } from '../utils/Routers';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
const walletRepository = new WalletRepository();
const walletHistoryRepository = new WalletHistoryRepository();
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorAuthRepository();
const walletService = new WalletService(walletRepository,walletHistoryRepository);
const walletController = new WalletController(walletService);

const authMiddleWare = new AuthMiddleware(patientRepository,doctorRepository);
const router = express.Router();

router.route(Routers.walletRouters.userWalletData)
.get(authMiddleWare.protect,authMiddleWare.isBlockedOrNot,walletController.getUserWalletData.bind(walletController));



export default router;
