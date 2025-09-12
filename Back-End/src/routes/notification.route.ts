import express from 'express';
import { NotificationController } from '../controllers/notification/notification.controller';
import { NotificationService } from '../services/notification/notification.service';
import { NotificationRepository } from '../repositories/notification/notification.repository';
import { Routers } from '../utils/Routers';

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

const router = express.Router();

router
  .route(Routers.notificationRouters.notificationWithPatientId)
  .get(notificationController.getUserNotification.bind(notificationController))
  .delete(
    notificationController.deleteAllNotification.bind(notificationController)
  );

router
  .route(Routers.notificationRouters.notificationWithNotificationId)
  .patch(notificationController.unReadNotification.bind(notificationController))
  .delete(
    notificationController.deleteNotification.bind(notificationController)
  );

export default router;
