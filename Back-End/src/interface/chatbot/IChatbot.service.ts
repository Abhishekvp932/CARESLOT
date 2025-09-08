import { ChatResponse } from '../../types/chatResponse';

export interface IChatbotService{
    processMessage(message:string):Promise<ChatResponse>;

}