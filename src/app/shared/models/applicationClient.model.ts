import { applicationClientType } from '../enums/applicationClientType.enum';

export interface applicationClient {
    id: string,
    base64Secret: string,
    name: string,
    applicationClientType: applicationClientType,
    enabled: boolean,
    refreshTokenLifeTime: number,
    url: string
}