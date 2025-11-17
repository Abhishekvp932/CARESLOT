import { Types } from 'mongoose';

export interface ISubscription{
    _id:string | Types.ObjectId
 name:string;
 price:number;
 discountAmount:number;
 durationInDays:number;
 createdAt:Date;
 updatedAt:Date;
}