import { Types } from 'mongoose';

export interface SubscriptionResult{
  _id:string | Types.ObjectId;
  name:string;
 price:number;
 discountAmount:number;
 durationInDays:number;
 createdAt?:Date;
 updatedAt?:Date;
}