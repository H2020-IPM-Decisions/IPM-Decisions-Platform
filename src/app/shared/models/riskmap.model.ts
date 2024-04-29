export interface RiskMapProvider{
    id: string,
    title: string,
    wmsUrl: string,
    providerId: string,
    providerName: string
}

export interface RiskMap{
    platformValidated: boolean,
    providerCountry: string,
    providerAddress: string,
    providerPostalCode: string,
    providerCity: string,
    providerEmail: string,
    providerUrl: string,
    mapConfiguration: MapConfiguration,
    id: string,
    title: string,
    wmsUrl: string,
    providerId: string,
    providerName: string
}

export interface MapConfiguration{
    name: string,
    title: string,
    abstract: string,     
    projection: string,   
    layersConfiguration: LayerConfigurarion[]
}

export interface LayerConfigurarion{
    name: string,
    title: string,
    dates: string[],
    legendURL: string
    legendMetadata: LegendMetadata
}

export interface LegendMetadata{
    isWarningStatus: boolean,
    legendItems: LegendItems[]
}

export interface LegendItems{
    classification: number,
    legendLabel: string,
    legendIconCSS: string
}