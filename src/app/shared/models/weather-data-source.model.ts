export interface WeatherDataSource {
  id?: string;
  name: string;
  description?: string;
  publicURL?: string;
  endpoint?: string;
  needsDataControl?: string;
  access_type?: string;
  spatial?: Spatial;
  temporal?: Temporal;
  parameters?: Parameters;
  organization?: Organization;
  authentication_required?: string;
}

interface Spatial {
  countries: string[];
  geoJSON: string;
}
interface Temporal {
  forecast: number;
  historic: Historic;
}
interface Parameters {
  common: number[];
  optional: number[];
}
interface Historic {
  start: string;
  end: string;
}
interface Organization {
  name: string;
  country: string;
  address: string;
  postal_code: string;
  city: string;
  email: string;
  url: string;
}
