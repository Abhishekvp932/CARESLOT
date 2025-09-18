import { IMessageRepository } from '../../interface/message/IMessageRepository';
import Message from '../../models/implementation/message.model';
import { IMessage } from '../../models/interface/IMessage';
import { BaseRepository } from '../base.repository';



export class MessageRepository extends BaseRepository <IMessage> implements IMessageRepository {
    constructor (){
        super(Message);
    }

    async findByChatId(chatId: string): Promise<IMessage[]> {
        return await Message.find({chatId:chatId});
    }

    async findByIdAndDelete(messageId: string): Promise<IMessage | null> {
        return await Message.findByIdAndDelete(messageId);
    }
}