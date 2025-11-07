import { IContactRepository } from '../../interface/contact/IContactRepository';
import { IContactService } from '../../interface/contact/IContactService';
import { ContactInterface, ContactRsult } from '../../types/contactResult';

export class ContactService implements IContactService{
    constructor(private _contactRepository:IContactRepository){}

    async createContactInfromation(senderName: string, senderEmail: string, senderPhone: string, message: string): Promise<{ msg: string; }> {
        const newContactInformation = {
            senderName:senderName,
            senderEmail:senderEmail,
            senderPhone:senderPhone,
            message:message,
        };

        await this._contactRepository.create(newContactInformation);

        return {msg:'Your Response submited'};
    }
    async getContactData(search: string, page: number, limit: number): Promise<ContactRsult> {
        const skip = (page - 1) * limit;
       const searchFilter = search
             ? {
                 $or: [
                   { senderName: { $regex: search, $options: 'i' } },
                   { senderEmail: { $regex: search, $options: 'i' } },
                 ],
               }
             : {};

     const [contactsList,total] = await Promise.all([
        this._contactRepository.findAllContactsWithPagination(skip,limit,searchFilter),
        this._contactRepository.countAll(searchFilter),
     ]);

     if(!contactsList){
        throw new Error('Contacts not found');
     }
     const contacts:ContactInterface[] = contactsList.map((contacts)=>({
       senderName:contacts.senderName,
       senderEmail:contacts.senderEmail,
       senderPhone:contacts.senderPhone,
       message:contacts.message,
       createdAt:contacts.createdAt,
     }));
     return {contacts,total};
    }
}