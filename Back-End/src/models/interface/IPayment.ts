import mongoose, { Document } from 'mongoose';

export interface IPayment extends Document {
  appoinmentId?: mongoose.Types.ObjectId;
  planId?:mongoose.Types.ObjectId
  patientId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  paymentMethod?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: Date;
  updatedAt: Date;
};
