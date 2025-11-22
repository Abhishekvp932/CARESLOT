import { IUserSubscriptionRepository } from '../../interface/userSubscription/IUserSubscriptionRepository';
import { IUserSubscriptionService } from '../../interface/userSubscription/IUserSubscriptionService';
import { IUserSubscriptionPopulated, UserSubscriptionPopulated } from '../../types/UserSubscriptionPopulated';

export class UserSubscriptionService implements IUserSubscriptionService {
    constructor(private _userSubscriptionRepository:IUserSubscriptionRepository){}

    async findAllUserSubscription(page:number,limit:number): Promise<UserSubscriptionPopulated> {
        const skip = (page-1)*limit;
        const [userSubscriptionList,total] = await Promise.all([
        this._userSubscriptionRepository.findAllUserSubscription(skip,limit),
        this._userSubscriptionRepository.countAll(),
        ]);

         const userSubscriptions:IUserSubscriptionPopulated[] = userSubscriptionList.map((sub)=>{
            return {
                _id:sub._id.toString(),
                patientId:{
                    _id:sub.patientId._id.toString(),
                    name:sub.patientId.name,
                    email:sub.patientId.email,
                },
                isActive:sub.isActive,
                createdAt:sub.createdAt,
                endDate:sub.endDate,
                planId:{
                    _id:sub.planId._id.toString(),
                    name:sub.planId.name,
                    price:sub.planId.price,
                },
            };
         });
        return {subscription:userSubscriptions,total};
    }
}