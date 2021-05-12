export interface DssModelExecution{
    type?:string;
    endpoint?:string;
}

export interface DssModel {
    name?:string;
    id?:string;
    version?:string;
    type_of_decision?:string;
    type_of_output?:string;
    description?:string;
    execution?:DssModelExecution;
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
    dssVersion?: string;
    cropPest?: DssCropPest;
    dssParameters?: string;
    dssExecutionType?: string;
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
    color?: string;
}

export interface IDssResultFlat {
    code?: string;
    title?: string;
    description?: string;
    chartType?: IDssResultChart;
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
    dssTypeOfOutput?: string;
    dssTypeOfDecision?: string;
    dssDescriptionUrl?: string;
    farmId?: string;
    fieldId?: string;
    warningStatusRepresentation?: string;
    outputTimeStart?: string;
    outputTimeEnd?: string;
    warningStatusPerDay?: number[];   
}