import { Schema } from 'mongoose';
import { IMessage } from '../interface/IMessage';
import mongoose from 'mongoose';


const messageSchema = new Schema<IMessage>({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true,
    },
   sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
   },
   type:{
    type:String,
    enum:['text','image']
   },
   content:{
    type:String,
   },
   image:{type:String},
   read:{
    type:Boolean,
    default:false
   }
},{timestamps:true});

const Message = mongoose.model<IMessage>('Message',messageSchema);
export default Message;