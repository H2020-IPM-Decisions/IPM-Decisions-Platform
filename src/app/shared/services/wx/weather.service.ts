import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import Ajv, { ErrorObject } from 'ajv';
import * as weatherDataSchema from "./schemas/weather-data-schema.json";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  weatherSchema: any = (weatherDataSchema as any).default;
  public errors$ = new Subject<ErrorObject[]>();

  constructor(private http: HttpClient) { }

  getWeatherData() {
    const url = 'http://localhost:8080/WeatherService/rest/schema/weatherdata';

    return this.http.get(url)
      .pipe(
        catchError(this.handleError),
        tap(data => {
          this.validateJsonFormat(data, this.weatherSchema);
        })
      );
  }
  
  getWeatherParameterList() {
    const url = 'http://localhost:8080/WeatherService/rest/parameter/list';

    return this.http.get(url)
      .pipe(catchError(this.handleError));
  }

  setWeatherForecast(longitude, latitude, altitude) {
    const url = 'http://ipmdecisions.nibio.no/WeatherService/rest/forecasts/yr/';

    return this.http.post(url, {
      params: {
        longitude: longitude,
        latitude: latitude,
        altitude: altitude
      }
    })
      .pipe(catchError(this.handleError));
  }

  private validateJsonFormat(data: any, schema: any) {
    var ajv = new Ajv({
      schemaId: 'id',
      meta: false, // optional, to prevent adding draft-06 meta-schema
      extendRefs: true, // optional, current default is to 'fail', spec behaviour is to 'ignore'
      unknownFormats: 'ignore',  // optional, current default is true (fail)
    });

    ajv.addMetaSchema(schema);
    var valid = ajv.validate(schema, data);
    if (!valid) {
      this.errors$.next(ajv.errors);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.message) {
      return throwError(errorMessage);
    }
    return throwError(errorRes.error.message);
  }
}
