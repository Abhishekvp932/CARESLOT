import mongoose,{Document} from 'mongoose';



export interface ILastMessage {
  content: string;
  timestamp: Date; 
}

export interface IChat extends Document {
    appoinmentId:mongoose.Types.ObjectId;
    doctorId:mongoose.Types.ObjectId;
    patiendId:mongoose.Types.ObjectId;
    isActive:boolean;
    participants: mongoose.Types.ObjectId[];
    createdAt:Date;
    updatedAt:Date;
    lastMessage?:ILastMessage;
}