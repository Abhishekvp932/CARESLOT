import express from 'express';
import { ChatController } from '../controllers/chat/chat.controllet';
import { ChatService } from '../services/chat/chat.service';
import { ChatRepository } from '../repositories/chat/chat.repository';
import { AppoinmentRepository } from '../repositories/appoinment/appoinment.repository';
import { PatientRepository } from '../repositories/auth/auth.repository';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import { MessageRepository } from '../repositories/message/message.repository';
import { Routers } from '../utils/Routers';
import { multiFileUpload } from '../middleware/multer.middleware';
import { NotificationRepository } from '../repositories/notification/notification.repository';
const chatRepository = new ChatRepository();
const appoinmentRepository = new AppoinmentRepository();
const patientRepository = new PatientRepository();
const doctorRepository = new DoctorAuthRepository();
const messageRepository = new MessageRepository();
const notificationRepository = new NotificationRepository();
const chatService = new ChatService(chatRepository,appoinmentRepository,patientRepository,doctorRepository,messageRepository,notificationRepository);
const chatController = new ChatController(chatService);

const router = express.Router();

router.route(Routers.chatRouters.getUserChat)
.get(chatController.getUserChat.bind(chatController));

router.route(Routers.chatRouters.sendMessage)
.post(multiFileUpload,chatController.sendMessage.bind(chatController));

router.route(Routers.chatRouters.getDoctorChat)
.get(chatController.getDoctorChat.bind(chatController));

router.route(Routers.chatRouters.getDoctorMessage)
.get(chatController.getDoctorMessage.bind(chatController));

router.route(Routers.chatRouters.getPatientMessage)
.get(chatController.getPatientMessage.bind(chatController));

router.route(Routers.chatRouters.deleteMessage)
.delete(chatController.deleteMessage.bind(chatController));

export default router;