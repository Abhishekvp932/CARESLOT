import mongoose,{Schema} from 'mongoose';
import { IAdmin } from '../interface/IAdmin';
const adminSchema = new Schema<IAdmin>({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin'],
        default:'admin'
    }
},{timestamps:true}); 

const Admin =  mongoose.model<IAdmin>('Admin',adminSchema);

export default Admin;