import { UpdateQuery } from 'mongoose';
import { ISubscription } from '../../models/interface/ISubscription';

export interface ISubscriptionRepository {
    create(data:Partial<ISubscription>):Promise<ISubscription | null>;
    findAll():Promise<ISubscription[]>;
    findByName(name:string):Promise<ISubscription | null>;
    findByIdAndDelete(subscriptionId:string):Promise<ISubscription | null>
    findById(subscriptionId:string):Promise<ISubscription | null>;
    findByIdAndUpdate(subscriptionId:string,subscripionData:UpdateQuery<ISubscription>):Promise<ISubscription | null>;
}
