import { UserDTO } from './user.dto';
export interface UserListResult {
  users: UserDTO[];
  total: number;
}
