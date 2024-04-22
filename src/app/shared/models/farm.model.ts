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
  isShared: boolean,
  owner: boolean,
  sharedPersonName: string,
}

export interface FarmShareRequest{
  id: string,
  requestStatus: string,
  requesteeId: string,
  requesteeName: string,
  requesterId: string,
  requesterName: string
}