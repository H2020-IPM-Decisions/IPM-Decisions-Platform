export interface Account {
    id: string
    email: string,
    token: string,
    tokenInit: number,
    tokenExpiration: number,
    refreshToken: string,
    claims: string[],
    roles: string[]
    //  tokenType: string
    //  issuer: string,
    //  audience: string
}