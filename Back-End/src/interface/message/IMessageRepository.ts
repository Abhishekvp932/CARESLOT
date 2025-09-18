import { IMessage } from '../../models/interface/IMessage';

export interface IMessageRepository {
    create(messageData:Partial<IMessage>):Promise<IMessage | null>;
    findByChatId(chatId:string):Promise<IMessage[]>;
    findByIdAndDelete(messageId:string):Promise<IMessage | null>;
    findById(messageId:string):Promise<IMessage | null>;    
}