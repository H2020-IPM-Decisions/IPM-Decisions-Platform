import { Link } from './link.model';
import { applicationClient } from './applicationClient.model';
export interface ShapedDataWithLinksRefreshTokens {
    value: applicationClient[],
    links: Link[]
}