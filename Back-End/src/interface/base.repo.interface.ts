export interface IBaseRepository <T>{
     findById?(id:string):Promise<T | null>;     
       findByEmail?(email:string):Promise<T | null>;
       create?(Data:Partial<T>):Promise<T>
       verifyOtp?(email:string,otp:string):Promise<boolean>
       findAllWithFilter(filter:any):Promise<T[]>;
       findAll():Promise<T | null>;
}