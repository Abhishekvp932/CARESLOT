import { ISubscriptionRepository } from '../../interface/subscription/ISubscriptionRepository';
import Subscription from '../../models/implementation/subscription.model';
import { ISubscription } from '../../models/interface/ISubscription';
import { BaseRepository } from '../base.repository';

export class SubscriptionRepository extends BaseRepository<ISubscription> implements ISubscriptionRepository{
    constructor(){
        super(Subscription);
    }

    async findByName(name: string): Promise<ISubscription | null> {
        return Subscription.findOne({name});
    }
    async findByIdAndDelete(subscriptionId: string): Promise<ISubscription | null> {
        return await Subscription.findByIdAndDelete(subscriptionId);
    }
}