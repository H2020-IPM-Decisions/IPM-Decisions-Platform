export class WeatherDataSourceDto {
  constructor(
    public id: string,
    public name: string,
    public isForecast: boolean,
    public authenticationRequired: boolean,
    public url: string
  ){}
}
