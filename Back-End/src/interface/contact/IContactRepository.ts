import { FilterQuery } from 'mongoose';
import { IContact } from '../../models/interface/IContact';

export interface IContactRepository {
    create(contactData:Partial<IContact>):Promise<IContact | null>;
    findAllContactsWithPagination(skip:number,limit:number,filter:FilterQuery<IContact>):Promise<IContact[]>;
    countAll(filter:FilterQuery<IContact>):Promise<number>;
}