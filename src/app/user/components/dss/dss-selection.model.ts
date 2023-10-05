export interface DssModelExecution{
    type?:string;
    endpoint?:string;
}

export interface DssModel {
    name?:string;
    id?:string;
    version?:string;
    pests?:string[];
    crops?:string[];
    type_of_decision?:string;
    type_of_output?:string;
    description?:string;
    description_URL?:string;
    execution?:DssModelExecution;
    output?:DssModelOutput;
    valid_spatial?:IDssModelValidSpatial;
    purpose?: string;
    authors?: IAuthors[];
    weatherParametersValidated?: boolean;
    alreadySavedByUser?: boolean;
    dssDatabaseId?: string;
}

export interface IDssModelValidSpatial {
    countries?: string[];
    geoJSON?: string;
}

export interface DssModelDescription {
    age?: string;
    case_studies?: string;
    created_by?: string;
    other?: string;
    peer_review?: string;
}

export interface DssModelOutput {
    warning_status_interpretation?:string;
}

export interface DssSelection {
    models?: DssModel[];
    id?:string;
    version?:string;
    name?:string;
    organization?: IOrganization;
    logo_url?: string;
    purpose?: string;
}

export interface IOrganization {
    address?: string;
    city?: string;
    country?: string;
    email?: string;
    name?: string;
    postal_code?: string;
    url?: string;
}

export interface DssJSONSchema {
    title?: string;
    description?: string;
    type?: string;
    properties?: any;
    required?: string[];
    definitions?: any;
}

export interface IDssFormData {
    id?:string;
    fieldId?: string;
    fieldName?: string;
    dssId?: string;
    dssName?: string;
    dssModelName?: string;
    dssModelId?: string;
    dssModelVersion?: string;
    dssParameters?: string;
    dssExecutionType?: string;
    cropEppoCode?: string;
    pestEppoCode?: string;
    sowingDate?: string;
    dssEndPoint?: string; //REQUIRED WHEN dssExecutionType = "link"
    dssVersion?: string;
}

export class DssCropPest {
    constructor(
        public cropEppoCode: string,
        public pestEppoCode: string
    ){}
}

export interface IDssResultChart{
    defaultVisible?: boolean;
    unit?: string;
    chartType?: string;
    color?: string|string[];
    options?:any;
}

export interface IDssResultFlat {
    code?: string;
    title?: string;
    description?: string;
    chartInformation?: IDssResultChart;
    data?: number[];
    labels?: string[];
}

export interface IDssFlat {
    alreadySavedByUser?: boolean;
    authors?: IAuthors[];
    chartGroups?: IDssChartGroup[];
    creationDate?: string;
    cropEppoCode?: string;
    dssDescription?: string;
    dssDatabaseId?: string;
    dssEndPoint?: string;
    dssExecutionType?:  string;
    dssFullResult?:  string;
    dssId?:  string;
    dssLogoUrl?: string;
    dssModelId?:  string;
    dssModelName?: string;
    dssModelVersion?: string;
    dssName?: string;
    dssPurpose?: string;
    dssSource?: string;
    dssTaskStatusDto?: IDssTaskStatusDto;
    dssTypeOfDecision?: string;
    dssTypeOfOutput?: string;
    dssVersion?: string;
    farmId?: string;
    farmName?: string;
    fieldId?: string;
    id?: string;
    interval?: string;
    isValid?: boolean;
    outputTimeEnd?: string;
    outputTimeStart?: string;
    pestEppoCode?: string;
    resultMessage?: string;
    resultMessageType?: string;
    resultParameters?: IDssResultFlat[];
    warningExplanation?: any;
    warningStatusLabels?: string[];
    warningStatusPerDay?: number[];
    warningStatus?: number;
    warningStatusRepresentation?: string;
    isDisabled?: boolean
}

export interface IAuthors {
    name?: string;
    organization?: string;
}

export interface IDssChartGroup {
    id?: string;
    title?: string;
    resultParameterIds?: string[];
    resultParameters?: IDssResultFlat[];
}


export interface IDssParameters {
    dssParameters?: any; //Can contains dynamic object depends on dss Model.
}

export class DssParameters {
    constructor( public dssParameters: string){}
}

export interface IDssTaskStatusDto {
    dssId?: string;
    id?: string;
    jobStatus?: string;
    scheduleTime?: string;
}

export interface IDssForAdaptation {
    dssOriginalResult?: IDssFlat;
    dssOriginalParameters?: DssJSONSchema;
}