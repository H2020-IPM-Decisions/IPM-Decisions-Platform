import { Farm } from "@app/shared/models/farm.model";

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
  authentication_type: string;
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

export interface AvailableWeatherStation{
  weatherId: string,
  name: string,
  url: string
}

export interface UserWeatherStation{
  WeatherId: string,
  WeatherStationId: string,
  WeatherStationReference:string,
  Username:string,
  Password:string
}

export interface UserWeatherStationUpdate{
  weatherStationId: string,
  weatherStationReference: string,
  userName: string,
  Password:string
}

export interface UserWeatherStationInfo{
  id: string,
  weatherId: string,
  weatherName: string,
  weatherStationId: string,
  weatherStationReference: string,
  userName: string,
  farms: Farm[]
}