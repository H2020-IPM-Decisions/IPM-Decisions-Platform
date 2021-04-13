import { Link } from "./link.model";
import { Location } from "./location.model";
import { WeatherDataSourceDto } from "./weather-data-source-dto.model";
import { WeatherStation } from "./weather-station.model";
export interface Farm {
  id: string;
  name: string;
  // inf1: string;
  // inf2: string;
  weatherDataSourceDto?: WeatherDataSourceDto;
  weatherStationDto?: WeatherStation;
  location?: Location;
  links?: Link[];
}


export class FarmImpl {
  constructor(
    public id?: string,
    public name?: string,
    public weatherDataSourceDto?: WeatherDataSourceDto,
    public weatherStationDto?: WeatherStation,
    public location?: Location,
    public links?: Link[]){}
}
