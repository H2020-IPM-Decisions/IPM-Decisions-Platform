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

export interface DssFormData {
    id?:string;
    fieldId?: string;
    fieldName?: string;
    dssId?: string;
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

