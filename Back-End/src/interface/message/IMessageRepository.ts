import { FilterQuery, UpdateQuery, UpdateWriteOpResult } from 'mongoose';
import { IMessage } from '../../models/interface/IMessage';

export interface IMessageRepository {
    create(messageData:Partial<IMessage>):Promise<IMessage | null>;
    findByChatId(chatId:string):Promise<IMessage[]>;
    findByIdAndDelete(messageId:string):Promise<IMessage | null>;
    findById(messageId:string):Promise<IMessage | null>; 
    findByChatIdAndUpdate(filter:FilterQuery<IMessage>,update:UpdateQuery<IMessage>):Promise<UpdateWriteOpResult>;   
}