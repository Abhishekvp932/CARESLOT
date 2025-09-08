import { INotification } from '../interface/INotification';
import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema<INotification>({
    userId:{
        type:String,
        required:true,
    },
   title:{
    type:String,
   },
   role:{
    type:String,
    enum:['patient','doctor','admin'],
   },
   message:{
    type:String,
   },
   isRead:{
    type:Boolean,
    defualt:false,
   },
   
},{timestamps:true});

const Notification = mongoose.model<INotification>('Notification',notificationSchema);

export default Notification;