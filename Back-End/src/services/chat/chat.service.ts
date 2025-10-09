import { IChatService } from '../../interface/chat/IChatService';
import { IChatRepository } from '../../interface/chat/IChatRepository';
import { IAppoinmentRepository } from '../../interface/appoinment/IAppoinmentRepository';
import { IpatientRepository } from '../../interface/auth/auth.interface';
import { IDoctorAuthRepository } from '../../interface/doctor/doctor.auth.interface';
import logger from '../../utils/logger';
import { ChatDTO } from '../../types/UserChatDto';

import { IMessageRepository } from '../../interface/message/IMessageRepository';
import { INotificationRepository } from '../../interface/notification/INotificationRepository';
import { Types } from 'mongoose';
import { io } from '../../server';
import { IMessageDto } from '../../types/IMessageDTO';
export class ChatService implements IChatService {
  constructor(
    private _chatRepository: IChatRepository,
    private _appoinmentRepository: IAppoinmentRepository,
    private _patientRepository: IpatientRepository,
    private _doctorRepository: IDoctorAuthRepository,
    private _messageRepository: IMessageRepository,
    private _notificationRepository:INotificationRepository,
  ) {}

  async getUserChat(patientId: string): Promise<ChatDTO[]> {
    if (!patientId) {
      throw new Error('Patiend id not found');
    }
    const appoinment = await this._appoinmentRepository.findByPatientId(
      patientId
    );
    if (!appoinment) {
      throw new Error('Appoinment Not found');
    }

    const chatDoctor = await this._chatRepository.findPatientChat(patientId);

    const chats: ChatDTO[] = chatDoctor.map((chat) => ({
      _id: chat._id as string,
      doctorId: {
        _id: chat.doctorId._id.toString(),
        name: chat.doctorId.name,
        profile_img: chat.doctorId.profile_img,
        specialization: chat.doctorId.qualifications?.specialization,
      },
      appoinmentId:chat.appoinmentId.toString(),
      isActive: chat.isActive,
      lastMessage:chat.lastMessage,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    return chats;
  }

  async sendMessage(
    chatId: string,
    content: string,
    sender: string,
    type: string,
    image:string,
  ): Promise<IMessageDto | null> {
    const chat = await this._chatRepository.findById(chatId);
   logger.debug('image is comming',image);
    if (!chat) {
      throw new Error('Chat not found');
    }

    chat.participants.forEach(async(participant)=>{
      if(participant?._id.toString() !== sender){


            const notif = await this._notificationRepository.create({
              userId:participant?._id.toString(),
              title:'New Message' ,
              message:`${content}`,
              isRead:false,
            });

        const reciverSocketId = participant?._id.toString();
       
         io.to(reciverSocketId).emit('notification',notif);
      }
    });

    const newMessage: Partial<IMessageDto> = {
      chatId: new Types.ObjectId(chatId),
      sender: new Types.ObjectId(sender),
      type: type,
      read: false,
      content: content,
      image:image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const message = await this._messageRepository.create(newMessage);
    await this._chatRepository.updateLastMessage(chatId, content);
    return message;
  }

  async getDoctorChat(doctorId: string): Promise<ChatDTO[]> {
    if (!doctorId) {
      throw new Error('doctor id not found');
    }
    const doctorChat = await this._chatRepository.findDoctorChat(doctorId);
      

 

    const chats: ChatDTO[] = doctorChat.map((chat) => ({
      _id: chat._id as string,
      appoinmentId:chat?.appoinmentId.toString(),
      patiendId: {
        _id: chat.patiendId._id.toString(),
        name: chat.patiendId.name,
        profile_img: chat.patiendId.profile_img,
      },
      isActive: chat.isActive,
      participants: chat.participants?.map((p) => p.toString()),
      lastMessage:chat.lastMessage,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
    }));

    return chats;
  }
  async getDoctorMessage(chatId: string): Promise<IMessageDto[]> {
    const message = await this._messageRepository.findByChatId(chatId);

    return message;
  }
  async getPatientMessage(chatId: string): Promise<IMessageDto[]> {
    const message = await this._messageRepository.findByChatId(chatId);
   logger.debug(message);
    return message;
  }
  async deleteMessage(messageId: string): Promise<{ msg: string; }> {

    if(!messageId){
      throw new Error('message id is not provided');
    }
    const message = await this._messageRepository.findById(messageId);
    if(!message){
      throw new Error('Message Not Found');
    }
    await this._messageRepository.findByIdAndDelete(messageId);
    return {msg:'message deleted'};
  }
}
