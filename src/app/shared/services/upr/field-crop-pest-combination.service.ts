import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@src/environments/environment";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FarmService } from "./farm.service";

@Injectable({
  providedIn: "root",
})
export class FieldCropPestCombinationService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient, private _farmService: FarmService) {}

  // Add Crop-Pest From Field
  public addCropPestFromField(fieldId: string): Observable<any> {
    let url = `${this.apiUrl}/api/upr/fields/${fieldId}/croppests`;
    return this._http
      .post(
        url,
        { cropEppoCode: "", pestEppoCode: "" },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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

  // Get Crop-Pest From Field
  public getCropPestFromField(
    fieldId: string,
    param?: string[]
  ): Observable<any> {
    let url = `${this.apiUrl}/api/upr/fields/${fieldId}/croppests`;

    if (param) {
      url += `pageSize,pageNumber`;
    }

    return this._http
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .pipe(
        catchError((error) => {
          console.log("error", error);
          return of(error);
        })
      );
  }

  // Delete Crop Pest By Id
  public deleteCropPestById(
    fieldId: string,
    cropPestId: string
  ): Observable<any> {
    let url = `${this.apiUrl}/api/upr/fields/${fieldId}/croppests/${cropPestId}`;

    return this._http
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .pipe(
        catchError((error) => {
          console.log("error", error);
          return of(error);
        })
      );
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

  // public getField(fields?: string[]): Observable<Field> {
  //   let url = `${this.apiUrl}/api/upr/farms/${this.farmId}`;
  //   if (fields) {
  //     url += `?${fields}`;
  //   }

  //   return this._http
  //     .get(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/vnd.h2020ipmdecisions.hateoas+json",
  //       },
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log("error", error);
  //         return of(error);
  //       })
  //     );
  // }

  // public updateField(operations: Operation[]): Observable<HttpResponse<any>> {
  //   return this._http
  //     .patch(`${this.apiUrl}/api/upr/farms/${this.farmId}`, operations, {
  //       headers: {
  //         "Content-Type": "application/json-patch+json",
  //       },
  //       observe: "response",
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log("error", error);
  //         return of(error);
  //       })
  //     );
  // }

  // public deleteFieldById(fieldId: string): Observable<HttpResponse<any>> {
  //   return this._http
  //     .delete(`${this.apiUrl}/api/upr/farms/${this.farmId}/fields/${fieldId}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       observe: "response",
  //     })
  //     .pipe(
  //       catchError((error) => {
  //         console.log("delete error", error);

  //         return of(error);
  //       })
  //     );
  // }

  // Get Field By Id and Associated Data

  // helper field methods
  // setCurrentField(field: Field) {
  //   console.log('curerntf field', field);

  //   this._fieldSubject.next(field);
  //   window.sessionStorage.setItem("field", JSON.stringify(field));
  // }
}
