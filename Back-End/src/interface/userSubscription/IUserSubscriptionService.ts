import { UserSubscriptionPopulated } from '../../types/UserSubscriptionPopulated';

export interface IUserSubscriptionService{
    findAllUserSubscription(page:number,limit:number):Promise<UserSubscriptionPopulated>;
}