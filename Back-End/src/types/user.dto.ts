export interface UserDTO {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  gender: 'male' | 'female' | 'others';
  DOB: Date;
  isBlocked: boolean;
  role: 'patients';
  createdAt?: Date;
  updatedAt?: Date;
  profile_img?: string;
}
