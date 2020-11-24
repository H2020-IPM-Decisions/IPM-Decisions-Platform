import { environment } from "@src/environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject, Observable } from "rxjs";
import Ajv, { ErrorObject } from "ajv";
import * as weatherDataSchema from "./schemas/weather-data-schema.json";
import { WeatherDataSource } from "@app/shared/models/weather-data-source.model";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  weatherSchema: any = (weatherDataSchema as any).default;
  public errors$ = new Subject<ErrorObject[]>();

  constructor(private http: HttpClient) {}

  weatherDataSourceLocationPoint(
    lat: number,
    lng: number,
    tol: number = 0
  ): Observable<WeatherDataSource[]> {
    return this.http
      .get<WeatherDataSource[]>(
        `https://ipmdecisions.nibio.no/api/wx/rest/weatherdatasource/location/point`,
        {
          headers: {
            Accept: "application/json",
          },
          params: {
            latitude: lat.toString(),
            longitude: lng.toString(),
            tolerance: tol.toString(),
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  getWeatherData() {
    const url = `${environment.weatherApi}/rest/schema/weatherdata`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap((data) => {
        this.validateJsonFormat(data, this.weatherSchema);
      })
    );
  }

  getWeatherParameterList() {
    const url = `${environment.weatherApi}/rest/parameter/list`;

    return this.http.get(url).pipe(catchError(this.handleError));
  }

  setWeatherForecast(longitude, latitude, altitude) {
    const url = `${environment.weatherApi}/rest/forecasts/yr/`;

    return this.http
      .post(url, {
        params: {
          longitude: longitude,
          latitude: latitude,
          altitude: altitude,
        },
      })
      .pipe(catchError(this.handleError));
  }

  private validateJsonFormat(data: any, schema: any) {
    var ajv = new Ajv({
      schemaId: "id",
      meta: false, // optional, to prevent adding draft-06 meta-schema
      extendRefs: true, // optional, current default is to 'fail', spec behaviour is to 'ignore'
      unknownFormats: "ignore", // optional, current default is true (fail)
    });

    ajv.addMetaSchema(schema);
    var valid = ajv.validate(schema, data);
    if (!valid) {
      this.errors$.next(ajv.errors);
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log("handle Error ", errorRes);

    let errorMessage = "An unknown error occured!";
    if (!errorRes.error || !errorRes.error.message) {
      return throwError(errorMessage);
    }
    return throwError(errorRes.error.message);
  }
}
