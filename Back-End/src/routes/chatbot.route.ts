import { ChatbotController } from '../controllers/chatbot/chatbot.controller';
import { ChatbotService } from '../services/chatbot/chatbot.service';
import { DoctorAuthRepository } from '../repositories/doctors/doctor.auth.repository';
import express from 'express';

const doctorRepository = new DoctorAuthRepository();
const chatbotservice = new ChatbotService(doctorRepository);
const chatbotController = new ChatbotController(chatbotservice);

const router = express.Router();

router.route('/chat').post(chatbotController.handleChatMessage.bind(chatbotController));


export default router;