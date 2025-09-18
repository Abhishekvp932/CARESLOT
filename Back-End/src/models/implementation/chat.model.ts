import { Schema} from 'mongoose';

import { IChat,ILastMessage } from '../interface/IChat';
import mongoose from 'mongoose';

const lastMessageSchema = new Schema<ILastMessage>({
    content:{
        type:String,
    },
    timestamp:{type:Date,default:Date.now},
});


const chatSchema = new Schema<IChat>({
    appoinmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Appoinment',
        required:true
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true,
    },
    patiendId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Patient',
        required:true
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    lastMessage:{
        type:lastMessageSchema,
        required:false
    }
},{timestamps:true});

const Chat = mongoose.model<IChat>('Chat',chatSchema);
export default Chat;