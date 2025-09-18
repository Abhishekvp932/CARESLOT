import { IChatbotService } from '../../interface/chatbot/IChatbot.service';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import logger from '../../utils/logger';
dotenv.config();

export class ChatbotService implements IChatbotService {
  constructor(private _doctorRepository: IDoctorAuthRepository) {}

  async processMessage(message: string): Promise<{ replay: string }> {
     const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

     const model = genAi.getGenerativeModel({model:'gemini-1.5-flash'});

     const prompt = `
You are a medical assistant chatbot for the CareSlot doctor booking website.
Answer only questions related to this website:
- Booking, rescheduling, or canceling appointments
- Doctor information and specializations
- General instructions for patients on using CareSlot

If the user asks about anything outside this website (like Java programming or world news), reply:
"I'm sorry, I can only provide information related to CareSlot website and its services."

User message: "${message}"
`;


      let result;

      for(let i =0;i<3;i++){
        try {
          result = await model.generateContent(prompt);
          break;
        } catch (err) {
          logger.debug(err);
          console.warn(`Retry ${i + 1} failed, retrying...`);
          await new Promise((res) => setTimeout(res, 1000));
        }
      }
      if(!result){
        return {replay:'server is busy. Please try again later.'};

      }
      return {replay:result.response.text()};
  }
}
