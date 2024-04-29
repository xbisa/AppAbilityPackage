import { Municipality } from './municipality.model';

export class Institution {
    id: string = '';
    name: string = '';
    date_created: string | Date = '';
    municipality: string | Municipality;
}