import { User } from './user.model';

export class ChangeGoals {
    id: string;
    date_created: string | Date;
    date_updated: string | Date;
    user: string | User;
    goal_description_parent: string;
    goal_description_child: string;
}