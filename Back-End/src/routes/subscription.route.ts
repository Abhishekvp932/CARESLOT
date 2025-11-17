import express from 'express';
import { SubscriptionController } from '../controllers/subscription/subscription.controller';
import { Routers } from '../utils/Routers';
import { SubscriptionService } from '../services/subscription/subscription.service';
import { SubscriptionRepository } from '../repositories/subscription/subscription.repository';


const router = express.Router();
const subscriptionRepository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(subscriptionRepository);
const subscriptionController = new SubscriptionController(subscriptionService);

router.route(Routers.subscriptionRouters.create)
.post(subscriptionController.createSubscription.bind(subscriptionController));

router.route(Routers.subscriptionRouters.getAllSubscription)
.get(subscriptionController.getAllSubscription.bind(subscriptionController));

router.route(Routers.subscriptionRouters.deleteSubscription)
.delete(subscriptionController.deleteSubscription.bind(subscriptionController));
export default router;
