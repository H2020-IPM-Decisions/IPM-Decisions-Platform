import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FarmModel } from "@app/shared/models/farm.model";
import { environment } from "@src/environments/environment";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class FarmService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  public createFarm(farm: FarmModel): Observable<HttpResponse<FarmModel>> {
    return this._http
      .post(`${this.apiUrl}/api/upr/farms`, farm, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.h2020ipmdecisions.hateoas+json",
        },
      })
      .pipe(
        catchError((error) => {
          console.log("error", error);
          return of(error);
        })
      );
  }

  public getFarms(params?: string[]): Observable<FarmModel[]> {
    return this._http
      .get(`${this.apiUrl}/api/upr/farms`, {
        headers: {
          Accept: "application/vnd.h2020ipmdecisions.hateoas+json",
        },
      })
      .pipe(
        catchError((error) => {
          console.log("error", error);

          return of(error);
        })
      );
  }
  public getFarmById(farmId: string, fields?: string[]): Observable<FarmModel> {
    let url = `${this.apiUrl}/api/upr/farms/${farmId}`;
    if (fields) {
      url += `?${fields}`;
    }

    console.log("url", url);

    return this._http
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.h2020ipmdecisions.hateoas+json",
        },
      })
      .pipe(
        catchError((error) => {
          console.log("error", error);
          return of(error);
        })
      );
  }

  public editFarmById(
    farmId: string,
    fields?: string[]
  ): Observable<FarmModel[]> {
    return this._http
      .get(`${this.apiUrl}/api/upr/farms`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.h2020ipmdecisions.hateoas+json",
        },
      })
      .pipe(
        catchError((error) => {
          console.log("error", error);
          return of(error);
        })
      );
  }
  public deleteFarmById(farmId: string): Observable<HttpResponse<any>> {
    return this._http.delete(`${this.apiUrl}/api/upr/farms/${farmId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        observe: 'response'
      })
      .pipe(
        catchError((error) => {
          console.log("delete error", error);

          return of(error);
        })
      );
  }
}
