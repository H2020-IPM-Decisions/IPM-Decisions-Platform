import { HttpClient } from "@angular/common/http";
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

  public createFarm(farm: FarmModel): Observable<FarmModel> {
    return this._http
      .post(
        `${this.apiUrl}/api/upr/farms`,
        { farm },
        {
          headers: {
            Accept: "application/vnd.h2020ipmdecisions.hateoas+json",
          },
        }
      )
      .pipe(
        catchError((error) => {
          console.log("error", error);

          return of(error);
        })
      );
  }
}
