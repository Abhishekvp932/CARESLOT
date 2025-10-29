import { FilterQuery } from 'mongoose';
import { IChat } from '../../models/interface/IChat';
import {IChatPopulated, IPatientChatPopulated } from '../../types/ChatAndDoctorPopulatedDTO';

export interface IChatRepository{
    create(chatData:Partial<IChat>):Promise<IChat | null>
    findPatientChat(patientId:string):Promise<IChatPopulated[]>;
    findById(chatId:string):Promise<IChat | null>;
    updateLastMessage(chatId:string,content:string):Promise<IChat | null>;
    findDoctorChat(doctorId:string):Promise<IPatientChatPopulated[]>;
    findByPatientIdAndUpdate(patientId:string,doctorId:string,filter?:FilterQuery<IChat>):Promise<IChat | null>;
}