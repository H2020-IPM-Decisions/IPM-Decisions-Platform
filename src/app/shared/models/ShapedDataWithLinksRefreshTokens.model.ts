import { applicationClient } from './applicationClient.model';
import { Link } from './link.model';
export interface ShapedDataWithLinksRefreshTokens {
    value: applicationClient[],
    links: Link[]
}