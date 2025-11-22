
export interface UserSubscriptionPatientPopulated {
    _id?:string;
    name?:string;
    email?:string;
}

export interface UserSubscriptionPlanPopulated{
 _id?:string;
 name?:string;
 price?:string;
}

export interface IUserSubscriptionPopulated {
    _id?:string;
    patientId?:UserSubscriptionPatientPopulated;
    planId?:UserSubscriptionPlanPopulated;
    transactionId?:string;
    startDate?:Date;
    endDate?:Date;
    isActive?:boolean;
    createdAt?:Date;
    updatedAt?:Date;
}

export interface UserSubscriptionPopulated {
    subscription:IUserSubscriptionPopulated[];
    total:number;
}