import { Farm } from './farm.model';
import { Link } from './link.model';

export interface FarmResponseModel {
    links: Link[],
    value: Farm[]
    
}