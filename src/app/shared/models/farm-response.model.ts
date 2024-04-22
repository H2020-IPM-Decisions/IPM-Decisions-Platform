import { Farm, FarmShareRequest } from './farm.model';
import { Link } from './link.model';

export interface FarmResponseModel {
    links: Link[],
    value: Farm[]
    
}

export interface FarmShareResponseModel {
    links: Link[],
    value: FarmShareRequest[];
}