import express from 'express';
import { UserSubscriptionController } from '../controllers/userSubscription/userSubscription.controller';
import { UserSubscriptionService } from '../services/userSubscription/userSubscription.service';
import { UserSubscriptionRepository } from '../repositories/userSubscription/userSubscription.repository';
import { Routers } from '../utils/Routers';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

const userSubscriptionRepository = new UserSubscriptionRepository();
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorAuthRepository();
const userSubscriptionService = new UserSubscriptionService(userSubscriptionRepository);
const userSubscriptionController = new UserSubscriptionController(userSubscriptionService);
const authMiddleWare = new AuthMiddleware(patientRepository,doctorRepository);
router.route(Routers.userSubscriptionRouters.findAllUserSubscription)
.get(authMiddleWare.protect,userSubscriptionController.findAllUserSubscription.bind(userSubscriptionController));


export default router;

