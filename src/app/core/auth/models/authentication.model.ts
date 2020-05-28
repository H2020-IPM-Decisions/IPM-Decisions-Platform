import { Claim } from './claim.model';
import { Role } from './role.model';

export interface Authentication {
    id: string,
    email: string,
    roles: Role[],
    claims: Claim[],
    token: string,
    tokenType: string,
    bearer: string
    refreshToken: string
}