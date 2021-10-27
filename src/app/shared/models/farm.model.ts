import { Address } from './address.model';
import { WeatherDataSourceDto } from "./weather-data-source.model";

export interface Location {
  x: number;
  y: number;
  z: number;
  zoom: number;
  srid: number;
  address: Address;
}

export interface Farm {
  id: string;
  name: string;
  location?: Location;
  weatherForecastDto: WeatherDataSourceDto;
  weatherHistoricalDto: WeatherDataSourceDto;
}