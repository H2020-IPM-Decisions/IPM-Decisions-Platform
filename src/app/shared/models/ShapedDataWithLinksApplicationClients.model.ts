import { Link } from './link.model';
import { applicationClient } from './applicationClient.model';
export interface ShapedDataWithLinksApplicationClients {
    value: applicationClient[],
    links: Link[]
}