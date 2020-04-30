import { applicationClientType } from '../enums/applicationClientType.enum';

export interface applicationClientForCreation {
    name: string,
    applicationClientType: applicationClientType,
    enabled: boolean,
    refreshTokenLifeTime: number,
    url: string
}