
import { IMessageDto } from '../../types/IMessageDTO';

import { ChatDTO } from '../../types/UserChatDto';

export interface IChatService {
    getUserChat(patientId:string):Promise<ChatDTO[]>;
    sendMessage(chatId:string,content:string,sender:string,type:string,image:string):Promise<IMessageDto | null>;
    getDoctorChat(doctorId:string):Promise<ChatDTO[]>;
    getDoctorMessage(chatId:string):Promise<IMessageDto[]>;
    getPatientMessage(chatId:string):Promise<IMessageDto[]>;
    deleteMessage(messageId:string):Promise<{msg:string}>;
}