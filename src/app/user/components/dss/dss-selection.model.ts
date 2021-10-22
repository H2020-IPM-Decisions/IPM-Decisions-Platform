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
    description?:DssModelDescription;
    execution?:DssModelExecution;
    output?:DssModelOutput;
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
    id?: string;
    creationDate?: string;
    cropEppoCode?: string;
    pestEppoCode?: string;
    dssId?:  string;
    dssModelId?:  string;
    isValid?: boolean;
    dssExecutionType?:  string;
    dssFullResult?:  string;
    warningMessage?: any;
    warningStatus?: number;
    resultParameters?: IDssResultFlat[];
    interval?: string;
    dssDescription?: string;
    dssModelName?: string;
    dssTypeOfOutput?: string;
    dssTypeOfDecision?: string;
    dssDescriptionUrl?: string;
    farmId?: string;
    farmName?: string;
    fieldId?: string;
    warningStatusRepresentation?: string;
    outputTimeStart?: string;
    outputTimeEnd?: string;
    warningStatusPerDay?: number[];
    chartGroups?: IDssChartGroup[];
}

export interface IDssChartGroup {
    id?: string;
    title?: string;
    resultParameterIds?: string[];
    resultParameters?: IDssResultFlat[];
}

// Interface for update dss parameters function on dss-selection service
export class DssParameters {
    constructor( public dssParameters: string){}
} 
    