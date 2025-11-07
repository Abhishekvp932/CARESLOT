import { ContactRsult } from '../../types/contactResult';

export interface IContactService {
    createContactInfromation(senderName:string,senderEmail:string,senderPhone:string,message:string):Promise<{msg:string}>
    getContactData(search?:string,page?:number,limit?:number):Promise<ContactRsult>;
}