export interface ContactInterface {
     senderName:string;
    senderEmail:string;
    senderPhone:string;
    message:string;
    createdAt:Date;
}

export interface ContactRsult {
    contacts:ContactInterface[];
    total:number
}