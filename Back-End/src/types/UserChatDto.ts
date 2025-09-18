export interface DoctorDTO {
  _id: string;
  name: string;
  profile_img: string;
  specialization?: string;
}
export interface patientDTO {
  _id: string;
  name: string;
  profile_img: string;
}


export interface ChatDTO {
  _id: string;
  appoinmentId?: string;
  patiendId?: patientDTO;
  doctorId?: DoctorDTO;
  isActive: boolean;
  participants?: string[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
}
