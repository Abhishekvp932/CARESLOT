import { IChatRepository } from '../../interface/chat/IChatRepository';
import { BaseRepository } from '../base.repository';
import { IChat } from '../../models/interface/IChat';
import Chat from '../../models/implementation/chat.model';
import {ChatDoctorPopulated, ChatPatientPopulated, IChatPopulated, IPatientChatPopulated } from '../../types/ChatAndDoctorPopulatedDTO';
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository{
    constructor(){
        super(Chat);
    }
      async findPatientChat(patientId: string): Promise<IChatPopulated[]> {
    const chats = await Chat.find({ patiendId: patientId })
      .populate<{ doctorId: ChatDoctorPopulated }>('doctorId', 'name profile_img qualifications.specialization')
      .exec();

    return chats as unknown as IChatPopulated[];
  }
 async updateLastMessage(chatId: string, content:string): Promise<IChat | null> {
      return await Chat.findByIdAndUpdate(chatId,{lastMessage:{content,timestamp:new Date()}});
  }
  async findDoctorChat(doctorId: string): Promise<IPatientChatPopulated[]> {
      const chats = await Chat.find({doctorId:doctorId})
      .populate<{patiendId:ChatPatientPopulated}>('patiendId','name profile_img')
      .exec();

      return chats as unknown as IPatientChatPopulated[];
  }
}