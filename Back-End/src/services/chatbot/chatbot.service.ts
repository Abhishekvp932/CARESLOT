import { IChatbotService } from '../../interface/chatbot/IChatbot.service';
import { ChatResponse} from '../../types/chatResponse';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import { DoctorDTO } from '../../types/doctor.dto';
import logger from '../../utils/logger';
export class ChatbotService implements IChatbotService {
  constructor (private _doctorRepository:IDoctorAuthRepository){}

  async processMessage(message: string): Promise<ChatResponse> {
 
      const symptomMap:Record<string,string>= {
        headache: 'Neurologist',
      fever: 'General Physician',
    chestpain: 'Cardiologist',
    skinrash: 'Dermatology',
    skin:'Dermatology',
    head:'Neurologist',
    cough: 'Pulmonologist',
      };
      const lowerMsg = message.toLowerCase();

      let specialization:string | null = null;

      for(const [symptom,spec] of Object.entries(symptomMap)){
       if(lowerMsg.includes(symptom)){
        specialization = spec;
        break;
       }
      }
  

      if(!specialization){
         return {
       specialization: null,
       doctors:[],
      message: 'Sorry, I couldn’t identify your issue. Please describe your symptoms differently.',
    };
      }
      const doctorsList = await this._doctorRepository.findAllWithFilter({
  'qualifications.specialization': specialization,
});
if(!doctorsList || doctorsList.length === 0){
   throw new Error('No doctors found');

  }
const doctorData = doctorsList.map((doctor) =>({
   name:doctor?.name ,
  profile_img:doctor?.profile_img,
  _id:doctor?._id,
}));
console.log(doctorData);
return {
  specialization,
  doctors:doctorData,
  message: `Based on your symptoms, you may need to consult a ${specialization}`,
};

  }
}