import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Field } from "@app/shared/models/field.model";
import { environment } from "@src/environments/environment";
import { Operation } from "fast-json-patch";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { catchError, share, take } from "rxjs/operators";
import { FarmService } from "./farm.service";

@Injectable({
  providedIn: "root",
})
export class FieldService {
  private apiUrl = environment.apiUrl;
  private farmId: string;
  private _fieldSubject = new BehaviorSubject<Field>(
    JSON.parse(window.sessionStorage.getItem("field"))
  );
  currentField = this._fieldSubject.asObservable();

  constructor(private _http: HttpClient, private _farmService: FarmService) {
    if (this._farmService.selectedFarm && this._farmService.selectedFarm.id) {
      this.farmId = this._farmService.selectedFarm.id;
    }
  }

  public createField(field: Field): Observable<Field> {
    return this._http.post<Field>(
      `${this.apiUrl}/api/upr/farms/${this.farmId}/fields`,
      field,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  public getFields(farmId: string): Observable<any> {
    // console.log("yyyyyyyyyyyyyyyyyy farm id", farmId);
    return this._http
      .get(`${this.apiUrl}/api/upr/farms/${farmId}/fields`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.h2020ipmdecisions.field.withchildren+json",
        },
      })
      .pipe(share());
  }

  // HATEOAS
  // public getFields(): Observable<HttpResponse<Field[]>> {

  //   const linkObj = this._farmService.selectedFarm.links.find(item => item.rel === "farm_fields");

  //   return this._http.get(linkObj.href, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Accept": "application/vnd.h2020ipmdecisions.hateoas+json"
  //       },
  //       observe: "response"
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log("error", error);

  //         return of(error);
  //       })
  //     );
  // }

  public getField(fieldId?: string, fields?: string[]): Observable<Field> {
    let url = `${this.apiUrl}/api/upr/farms/${this.farmId}/fields/${fieldId}`;

    if (fields) {
      url += `?${fields}`;
    }

    return this._http
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/vnd.h2020ipmdecisions.field.withchildren+json",
        },
      })
      .pipe(
        catchError((error) => {
          console.log("error", error);
          return of(error);
        })
      );
  }

  public updateField(
    fieldId: string,
    operations: Operation[]
  ): Observable<any> {
    return this._http.patch(
      `${this.apiUrl}/api/upr/farms/${this.farmId}/fields/${fieldId}`,
      operations,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        observe: "response",
      }
    );
  }

  public deleteFieldById(fieldId: string): Observable<HttpResponse<any>> {
    return this._http
      .delete(`${this.apiUrl}/api/upr/farms/${this.farmId}/fields/${fieldId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        observe: "response",
      })
      .pipe(
        catchError((error) => {
          console.log("delete error", error);

          return of(error);
        })
      );
  }

  // Get Field By Id and Associated Data

  // helper field methods
  setCurrentField(field: Field) {
    this._fieldSubject.next(field);
    window.sessionStorage.setItem("field", JSON.stringify(field));
  }
}
