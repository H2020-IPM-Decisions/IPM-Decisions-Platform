export interface IDSSDisabled{
    id?: string,
    dssId?: string,
    dssName: string,
    dssVersion: string,
    dssModelId: string,
    dssModelName: string,
    dssModelVersion: string,
    isDisabled: boolean
}

export interface IDSSDisabledFormData{
    DSSID: string,
    DSSVERSION: string,
    DSSMODELID: string,
    DSSMODELVERSION: string
}