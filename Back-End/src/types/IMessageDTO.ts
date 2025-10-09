import mongoose from 'mongoose';


export interface IMessageDto {
    chatId:mongoose.Types.ObjectId;
        sender?:mongoose.Types.ObjectId;
        type:'text' | 'image' | string;
        content:string;
        read:boolean;
        image?:string;
        createdAt:Date;
        updatedAt:Date;
}