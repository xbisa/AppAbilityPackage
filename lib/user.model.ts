import { UserRole } from './enums/user-role.enum';
import { UserStatus } from './enums/user-status.enum';
import { Municipality } from './municipality.model';

export class User {
  id: string = '';
  password: string = '';
  email: string = '';
  email_verified: boolean = false;
  first_name: string = '';
  last_name: string = '';
  role: UserRole = UserRole.PARENT;
  status: UserStatus = UserStatus.ACTIVE;
  date_created: string | Date = '';
  last_access?: string | Date = '';
  coach: string | null | User;
  municipality: string | null | Municipality;
}
