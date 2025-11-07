import { FilterQuery } from 'mongoose';
import { IContactRepository } from '../../interface/contact/IContactRepository';
import Contact from '../../models/implementation/contact.model';
import { IContact } from '../../models/interface/IContact';
import { BaseRepository } from '../base.repository';

export class ContactRepository extends BaseRepository<IContact> implements IContactRepository {
    constructor(){
        super(Contact);
    }

    async findAllContactsWithPagination(skip: number, limit: number, filter: FilterQuery<IContact>={}): Promise<IContact[]> {
        return await  Contact.find(filter)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .lean();
    }
     async countAll(filter:FilterQuery<IContact>): Promise<number> {
      return await Contact.countDocuments(filter);    
    }
}