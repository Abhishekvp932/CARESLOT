export interface INotificationDto {
     userId:string;
    title:string;
    role:'patient' | 'doctor' | 'admin';
    message:string;
    isRead?:boolean;
    createdAt?:Date;
    updatedAt?:string;
}