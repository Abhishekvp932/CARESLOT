import { UpdateQuery } from 'mongoose';
import { IUserSubscription } from '../../models/interface/IUserSubscription';
import { UserSubscriptionPatientPopulated, UserSubscriptionPlanPopulated } from '../../types/UserSubscriptionPopulated';

export interface IUserSubscriptionRepository{
    create(data:Partial<IUserSubscription>):Promise<IUserSubscription | null>
    findByActiveUserId(patientId:string):Promise<IUserSubscription | null>;
    updateById(userSubscriptionId:string,data:UpdateQuery<IUserSubscription>):Promise<IUserSubscription | null>;
    findAllUserSubscription(skip:number,limit:number):Promise<(IUserSubscription &{patientId:UserSubscriptionPatientPopulated;planId:UserSubscriptionPlanPopulated})[]>;
    countAll():Promise<number>;
}