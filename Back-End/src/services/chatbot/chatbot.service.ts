// import fetch from "node-fetch";
import { IChatbotService } from '../../interface/chatbot/IChatbot.service';
import { IDoctorAuthRepository } from '../../interface/doctor/IDoctorRepository';
export class ChatbotService implements IChatbotService {
  constructor(private _doctorRepository: IDoctorAuthRepository) {}
  async processMessage(message: string): Promise<{ replay: string }> {
    try {
      const doctors = await this._doctorRepository.findAllWithFilter({
        isApproved: true,
        isBlocked: false,
      });
      const doctorList = await doctors
        .map(
          (d) =>
            `${d?.name} - ${d?.qualifications?.specialization} ${d?.qualifications?.experince} years of experience ,${d.avgRating} rating, ${d.qualifications?.fees} fees`
        )
        .join('/n');
      const prompt = `
You are **CareBot**, the official AI medical assistant for the CareSlot doctor booking platform.

🎯 Your Purpose:
Help patients navigate CareSlot — booking appointments, finding suitable doctors, and getting basic health guidance.

🩺 Key Rules:
1. ONLY answer questions related to CareSlot services or general health guidance.
2. Never give deep medical advice or diagnosis — instead, suggest the **right doctor or specialization**.
3. You have access to the list of verified doctors on CareSlot (shown below).
4. When users describe symptoms, suggest the best doctor **based on specialization**.
5. Be polite, concise, and use friendly but professional language.
6. If the question is unrelated to CareSlot, respond with:  
   “I can help only with CareSlot services and doctor recommendations 😊.”

👨‍⚕️ Available Doctors:
${doctorList}

💬 User’s Question:
"${message}"
`;

      const response = await fetch(process.env.OPEN_AI_URL as string, {
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
              content: prompt,
            },
            { role: 'user', content: message },
          ],
        }),
      });

      const data = await response.json();
      return { replay: data.choices[0].message.content };
    } catch (err) {
      console.error(err);
      return { replay: 'Server is busy. Please try again later.' };
    }
  }
}
