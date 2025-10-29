import mongoose, { Schema } from 'mongoose';
import { IPrescription } from '../interface/IPrescription';

const prescriptionSchema = new Schema<IPrescription>({
   appoinmentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Appoinment',
    required:true,
   },
   doctorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Doctor',
    required:true,
   },
   patientId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Patient',
    required:true,
   },
   diagnosis:{
    type:String
   },
   medicines:{
    type:String,

   },
   advice:{
    type:String
   },

},{timestamps:true});


const Prescription = mongoose.model<IPrescription>('Prescription',prescriptionSchema);
export default Prescription;