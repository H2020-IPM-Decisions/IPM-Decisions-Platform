import { WeatherDataSourceDto } from "./weather-data-source.model";

export interface Location {
  x: number;
  y: number;
  z: number;
  srid: number;
  address?: any;
}
export interface Farm {
  id: string;
  name: string;
  location?: Location;
  weatherForecastDto: WeatherDataSourceDto;
  weatherHistoricalDto: WeatherDataSourceDto;
}