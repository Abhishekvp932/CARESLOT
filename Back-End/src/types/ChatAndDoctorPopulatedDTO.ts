import { Types } from 'mongoose';
import { IChat } from '../models/interface/IChat';
export interface ChatDoctorPopulated {
  _id: Types.ObjectId;
  name: string;
  profile_img: string;
  qualifications: {
    specialization: string;
  };
}

export type IChatPopulated = Omit<IChat, 'doctorId'> & {
  doctorId: ChatDoctorPopulated;
};

export interface ChatPatientPopulated {
    _id:Types.ObjectId;
    name:string;
    profile_img:string;
}

export type IPatientChatPopulated = Omit<IChat,'patiendId'> & {
  patiendId:ChatPatientPopulated;
};