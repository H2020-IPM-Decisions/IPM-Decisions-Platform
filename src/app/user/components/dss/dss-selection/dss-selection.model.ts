export interface Author {
    name: string;
    email: string;
    organization: string;
}

export interface Execution {
    type: string;
    endpoint: string;
    form_method: string;
    content_type: string;
    input_schema: string;
}

export interface Weather {
    parameter_code: number;
    interval: number;
}

export interface FieldObservation {
    species: string[];
}

export interface Input {
    weather: Weather[];
    field_observation: FieldObservation;
}

export interface ValidSpatial {
    countries: string[];
    geoJSON: string;
}

export interface ResultParameter {
    id: string;
    title: string;
    description: string;
}

export interface Output {
    warning_status_interpretation: string;
    result_parameters: ResultParameter[];
}

export interface Model {
    name: string;
    id: string;
    version: string;
    type_of_decision: string;
    type_of_output: string;
    description_URL: string;
    description: string;
    citation?: any;
    keywords: string;
    pests: string[];
    crops: string[];
    authors: Author[];
    execution: Execution;
    input: Input;
    valid_spatial: ValidSpatial;
    output: Output;
}

export interface Organization {
    name: string;
    country: string;
    address: string;
    postal_code: string;
    city: string;
    email: string;
    url: string;
}

export interface DssSelection {
    models: Model[];
    id: string;
    version: string;
    name: string;
    url: string;
    languages: string[];
    organization: Organization;
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
    id?:any;
    schema: DssJSONSchema;
    model: any;
}