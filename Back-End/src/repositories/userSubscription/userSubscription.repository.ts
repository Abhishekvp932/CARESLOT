import { UpdateQuery } from 'mongoose';
import { IUserSubscriptionRepository } from '../../interface/userSubscription/IUserSubscriptionRepository';
import UserSubscription from '../../models/implementation/usersubscription.model';
import { IUserSubscription } from '../../models/interface/IUserSubscription';
import { BaseRepository } from '../base.repository';
import { UserSubscriptionPatientPopulated, UserSubscriptionPlanPopulated } from '../../types/UserSubscriptionPopulated';

export class UserSubscriptionRepository extends BaseRepository<IUserSubscription> implements IUserSubscriptionRepository {
    constructor(){
        super(UserSubscription);
    }
    async findByActiveUserId(patientId: string): Promise<IUserSubscription | null> {
        return await UserSubscription.findOne({patientId,isActive:true});
    }
  async updateById(userSubscriptionId: string, data: UpdateQuery<IUserSubscription>): Promise<IUserSubscription | null> {
      return await UserSubscription.findByIdAndUpdate({userSubscriptionId},data,{new:true});
  }
  async findAllUserSubscription(skip:number,limit:number): Promise<(IUserSubscription & { patientId: UserSubscriptionPatientPopulated; planId: UserSubscriptionPlanPopulated; })[]> {
      const UserSubscriptions = await UserSubscription.find()
      .populate('patientId','_id name email')
      .populate('planId','_id price name')
      .sort({createdAt:-1})
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();


      return UserSubscriptions as unknown as (IUserSubscription & {
        patientId:UserSubscriptionPatientPopulated;
        planId:UserSubscriptionPlanPopulated;
      })[];
  }
  async countAll(): Promise<number> {
    return await UserSubscription.countDocuments();
  }
} 