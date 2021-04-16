export interface Historic {
  start: string;
  end?: any;
}

export interface Temporal {
  forecast: number;
  historic: Historic;
}

export interface Parameters {
  common: number[];
  optional: number[];
}

export interface Spatial {
  countries: string[];
  geoJSON: string;
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

export interface WeatherDataSource {
  id: string;
  name: string;
  description: string;
  public_URL: string;
  endpoint: string;
  authentication_required: string;
  needs_data_control: string;
  access_type: string;
  temporal: Temporal;
  parameters: Parameters;
  spatial: Spatial;
  organization: Organization;
}

// UPS RELEASE 0.2.2.1 WeahterDataSourceDto changes to WeatherForecastDto
export class WeatherDataSourceDto {
  constructor(
    public weatherId: string,
    public name: string,
    public url: string,
    public id?: string
  ){}
}