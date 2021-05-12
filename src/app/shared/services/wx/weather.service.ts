import { environment } from "@src/environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, tap } from "rxjs/operators";
import { throwError, Subject, Observable, BehaviorSubject, Subscription, Subscriber } from "rxjs";
import Ajv, { ErrorObject } from "ajv";
import * as weatherDataSchema from "./schemas/weather-data-schema.json";
import { WeatherDataSource, WeatherDataSourceDto } from "@app/shared/models/weather-data-source.model";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  private apiUrl = environment.apiUrl;
  weatherSchema: any = (weatherDataSchema as any).default;
  private metStationSubject = new BehaviorSubject<WeatherDataSource[]>(null);
  metStation = this.metStationSubject.asObservable();
  public errors$ = new Subject<ErrorObject[]>();

  constructor(private http: HttpClient) {}

  getWeatherDataSourceLocationPoint(
    lat: number,
    lng: number,
    tol: number = 0
  ): Observable<WeatherDataSource[]> {
    return this.http
      .get<WeatherDataSource[]>(
        `${environment.apiUrl}/api/wx/rest/weatherdatasource/location/point`,
        {
          headers: {
            "Content-Type": "*/*",
            Accept: "application/json",
          },
          params: {
            latitude: lat.toString(),
            longitude: lng.toString(),
            tolerance: tol.toString(),
          },
        }
      )
      .pipe(
        map((weatherMetStations) => {
          this.metStationSubject.next(weatherMetStations);
          return weatherMetStations;
        }),
        map((data: WeatherDataSource[]) => {
          return data.map((item: WeatherDataSource, index: number) => ({
            ...item,
            id: `${index}`,
          }));
        }),
        catchError(this.handleError)
      );
  }

  private getWeatherDataSource(): Observable<WeatherDataSource[]> {
    return this.http.get<WeatherDataSource[]>(
        `${environment.apiUrl}/api/wx/rest/weatherdatasource`,
        {
          headers: {
            "Content-Type": "*/*",
            Accept: "application/json",
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * FETCH MET. STATION LIST
   */
  public getMetStations(): Observable<WeatherDataSource[]> {
    return this.getWeatherDataSource().pipe(
      map((data: WeatherDataSource[]) => {
        return data.filter(
          (item: WeatherDataSource) => item.access_type === "location"
        );
      }),
      map((data: WeatherDataSource[]) => {
        return data.map((item: WeatherDataSource, index: number) => ({
          ...item,
          id: `${index}`,
        }));
      })
    );
  }

  public getWeatherDataSourceWithAuthentication(): Observable<WeatherDataSource[]> {
    return this.getWeatherDataSource().pipe(
      map((data: WeatherDataSource[]) => {
        return data.filter(
          (item: WeatherDataSource) => {
            return item.authentication_required === "true"
          }
        );
      })
    );
  }

  // objects in WeatherDataSource array reducted to show id and name
  /*public getMeteorologicalStationIdName(): Observable<WeatherDataSource[]> {
    return this.getMetStations().pipe(
      map((data: WeatherDataSource[]) => {
        return data.map((item: WeatherDataSource) => {
          return { id: item["id"], name: item["name"] };
        });
      })
    );
  }*/

  /**
   * FETCH FORECAST SERVICE LIST
   */
  public getForecastServices(): Observable<WeatherDataSource[]> {
    return this.getWeatherDataSource().pipe(
      map((data: WeatherDataSource[]) => {
        return data.filter(
          (item: WeatherDataSource) => item.access_type === "stations"
        );
      }),
      map((data: WeatherDataSource[]) => {
        return data.map((item: WeatherDataSource, index: number) => ({
          ...item,
          id: `${index}`,
        }));
      })
    );
  }

  // objects in WeatherDataSource array reducted to show id and name
  /*public getWeatherForecastIdName(): Observable<WeatherDataSource[]> {
    return this.getForecastServices().pipe(
      map((data: WeatherDataSource[]) => {
        return data.map((item: WeatherDataSource) => {
          return { id: item["id"], name: item["name"] };
        });
      })
    );
  }*/

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

  public getWeatherForecastDto(reqParams?:{latitude:string, longitude:string, tolerance:string}): Observable<WeatherDataSourceDto[]> {
    const requestObservable = new Observable( (observer:Subscriber<WeatherDataSourceDto[]>)=>{
      this.http.get<WeatherDataSource[]>(
        `${this.apiUrl}/api/wx/rest/weatherdatasource`,
        {
          headers: {"Content-Type": "*/*", Accept: "application/json"},
          params: reqParams
        }
      ).subscribe((data:WeatherDataSource[])=>{
        observer.next(
          data
            .filter(
              (item: WeatherDataSource) => {
                if(reqParams){
                  return item.access_type === "location";
                }
                // return item.access_type === "stations" && item.authentication_required === "false";
                return item.authentication_required === "false";
              }
            )
            .map( 
              (weatherDataSource:WeatherDataSource) => new WeatherDataSourceDto(weatherDataSource.name, weatherDataSource.name, weatherDataSource.endpoint)
            )
        );
        observer.complete();
      });
    });
    return requestObservable;
  }
}
