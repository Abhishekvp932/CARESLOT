import { IContact } from '../interface/IContact';
import mongoose, { Schema } from 'mongoose';

const contactSchema = new Schema<IContact>({
    senderEmail:{
        type:String,
        required:true,
    },
    senderName:{
        type:String,
        required:true,
    },
    senderPhone:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    }

},{timestamps:true});

const Contact = mongoose.model<IContact>('Contact',contactSchema);

export default Contact;

