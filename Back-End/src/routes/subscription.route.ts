import express from 'express';
import { SubscriptionController } from '../controllers/subscription/subscription.controller';
import { Routers } from '../utils/Routers';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { SubscriptionRepository } from '../repositories/subscription/subscription.repository';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { AuthMiddleware } from '../middleware/auth.middleware';


const router = express.Router();
const subscriptionRepository = new SubscriptionRepository();
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorAuthRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController = new SubscriptionController(subscriptionService);
const authMiddleWare = new AuthMiddleware(patientRepository,doctorRepository);
router.route(Routers.subscriptionRouters.create)
.post(authMiddleWare.protect,subscriptionController.createSubscription.bind(subscriptionController));

router.route(Routers.subscriptionRouters.getAllSubscription)
.get(authMiddleWare.protect,subscriptionController.getAllSubscription.bind(subscriptionController));

router.route(Routers.subscriptionRouters.deleteSubscription)
.delete(authMiddleWare.protect,subscriptionController.deleteSubscription.bind(subscriptionController));

router.route(Routers.subscriptionRouters.getAllActiveSubscription)
.get(authMiddleWare.protect,subscriptionController.getAllActiveSubscription.bind(subscriptionController));

router.route(Routers.subscriptionRouters.editSubscription)
.put(authMiddleWare.protect,subscriptionController.editSubscription.bind(subscriptionController));
export default router;
