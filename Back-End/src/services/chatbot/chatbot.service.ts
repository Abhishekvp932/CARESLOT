// import fetch from "node-fetch";
import { IChatbotService } from '../../interface/chatbot/IChatbot.service';
import { IDoctorAuthRepository } from '../../interface/doctor/IDoctorRepository';
export class ChatbotService implements IChatbotService {
  constructor(private _doctorRepository: IDoctorAuthRepository) {}
  async processMessage(message: string): Promise<{ replay: string }> {
    try {
const prompt = `
You are a medical assistant chatbot for the CareSlot doctor booking website.

Rules:
1. Answer **only** questions related to CareSlot.
2. Focus on:
   - Booking, rescheduling, or canceling appointments
   - Doctor information, specializations, and availability
   - General instructions for patients on using CareSlot
   - If a patient describes symptoms, suggest the **relevant medical department** (e.g., cardiology, dermatology, ENT, etc.) based on their symptoms.
4. Always be polite and professional.

User question: "${message}"
`;


      const response = await fetch(
        process.env.OPEN_AI_URL as string,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mistralai/mixtral-8x7b-instruct',
            messages: [
              {
                role: 'system',
                content:prompt,
              },
              { role: 'user', content: message },
            ],
          }),
        }
      );

      const data = await response.json();
      return { replay: data.choices[0].message.content };
    } catch (err) {
      console.error(err);
      return { replay: 'Server is busy. Please try again later.' };
    }
  }
}
