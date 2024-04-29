import { User } from './user.model';
import { ObservationMethod } from './observation-method.model';

export class Behavior {
  id: string = '';
  behavior: string = '';
  description: string = '';
  user: string | User = '';
  desired: boolean = false;
  date_created: string | Date = '';
  date_updated: string | Date = '';
  observation_methods: string[] | ObservationMethod[] = [];
  observers: string[] | User[] = [];
}
