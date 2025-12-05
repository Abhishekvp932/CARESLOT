import { ISubscriptionRepository } from '../../interface/subscription/ISubscriptionRepository';
import { ISubcriptionService } from '../../interface/subscription/ISubscriptionService';
import { EditSubscriptionData } from '../../types/EditSubscriptionType';
import { SubscriptionResult } from '../../types/SubscriptionResult';
import logger from '../../utils/logger';

export class SubscriptionService implements ISubcriptionService {
  constructor(private _subscriptionRepository: ISubscriptionRepository) {}

  async createSubscription(
    name: string,
    price: number,
    discountAmount: number,
    durationInDays: number
  ): Promise<{ msg: string }> {
    const isExists = await this._subscriptionRepository.findByName(name);

    if (isExists) {
      throw new Error('This plan Already exists');
    }

    const newSubscriptionData = {
      name,
      price,
      discountAmount,
      durationInDays,
    };

    await this._subscriptionRepository.create(newSubscriptionData);
    return { msg: 'New Plan Added' };
  }

  async getAllAdminSubscription(): Promise<SubscriptionResult[]> {
    const subscriptionList = await this._subscriptionRepository.findAll();
    logger.debug(subscriptionList);
    const subscriptions: SubscriptionResult[] = subscriptionList.map((sub) => {
      return {
        _id: sub._id,
        name: sub.name,
        price: sub.price,
        discountAmount: sub.discountAmount,
        durationInDays: sub.durationInDays,
        createdAt: sub.createdAt,
      };
    });

    return subscriptions;
  }

  async deleteSubscription(subscriptionId: string): Promise<{ msg: string }> {
    await this._subscriptionRepository.findByIdAndDelete(subscriptionId);

    return { msg: 'Plan Removed' };
  }

  async getAllActiveSubscription(): Promise<SubscriptionResult[]> {
    const subscriptionList = await this._subscriptionRepository.findAll();
    logger.debug(subscriptionList);
    const subscriptions: SubscriptionResult[] = subscriptionList.map((sub) => {
      return {
        _id: sub._id,
        name: sub.name,
        price: sub.price,
        discountAmount: sub.discountAmount,
        durationInDays: sub.durationInDays,
        createdAt: sub.createdAt,
      };
    });

    return subscriptions;
  }
  async editSubscription(
    subscriptionData: EditSubscriptionData
  ): Promise<{ msg: string }> {
    const subscriptionId = subscriptionData._id;
    const subscription = await this._subscriptionRepository.findById(
      subscriptionId
    );

    if (!subscription) {
      throw new Error('subscription not found');
    }

    const newSubscirptionData = {
      price: subscriptionData.price,
      discountAmount: subscriptionData.discountAmount,
      durationInDays: subscriptionData.durationInDays,
    };

    await this._subscriptionRepository.findByIdAndUpdate(
      subscriptionId,
      newSubscirptionData
    );

    return { msg: 'Subscription Updated Success' };
  }
}
