import mongoose , {Schema} from 'mongoose';
import { IPayment } from '../interface/IPayment';

const paymentSchema = new Schema<IPayment>({
  appoinmentId : {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Appoinment',
  },
  patientId : {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Patient',
    required:true,
  },
  planId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Subscription',
  },
  doctorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Doctor',
  },
  amount:{
    type:Number
  },
  currency:{
    type:String,
  },
  status:{
    type:String,
    enum : ['created','paid','failed'],
    default : 'created'
  },
  paymentMethod:{
    type:String
  },
  razorpayOrderId:{
    type:String,
  },
  razorpayPaymentId:{
    type:String
  },
  razorpaySignature:{
    type:String,
  }
},{timestamps:true});

const Payment = mongoose.model<IPayment>('Payment',paymentSchema);
export default Payment;