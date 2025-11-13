
import { ClientSession, FilterQuery } from 'mongoose';

export interface IBaseRepository <T>{
     findById?(id:string):Promise<T | null>;     
       findByEmail?(email:string):Promise<T | null>;
       create?(Data:Partial<T>,session?:ClientSession):Promise<T>
       verifyOtp?(email:string,otp:string):Promise<boolean>
       findAllWithFilter(filter:FilterQuery<T>):Promise<T[]>;
       findAll():Promise<T[]>;
}