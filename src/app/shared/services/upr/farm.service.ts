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
}
