import { Role } from './role.enum';
import { Claim } from './claim.model';

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