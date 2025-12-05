import { EditSubscriptionData } from '../../types/EditSubscriptionType';
import { SubscriptionResult } from '../../types/SubscriptionResult';

export interface ISubcriptionService {
    createSubscription(name:string,price:number,discountAmount:number,durationInDays:number):Promise<{msg:string}>
    getAllAdminSubscription():Promise<SubscriptionResult[]>;
    deleteSubscription(subscriptionId:string):Promise<{msg:string}>;
    getAllActiveSubscription():Promise<SubscriptionResult[]>;
    editSubscription(subscriptionData:EditSubscriptionData):Promise<{msg:string}>
}