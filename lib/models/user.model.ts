import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Institution } from './institution.model';
import { Municipality } from './municipality.model';

export class User {
    id: string = '';
    password: string = '';
    email: string = '';
    email_verified: boolean = false;
    first_name: string = '';
    last_name: string = '';
    roles: Array<UserRole> = [UserRole.PARENT];
    status: UserStatus = UserStatus.ACTIVE;
    date_created: string | Date = '';
    last_access?: string | Date = '';
    coaches: string[] | User[] = [];
    municipality: string | null | Municipality;
    institution: string | null | Institution;
}
