import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FarmResponseModel } from "@app/shared/models/farm-response.model";
import { Farm } from "@app/shared/models/farm.model";
import { environment } from "@src/environments/environment";
import { Operation } from "fast-json-patch";
import { BehaviorSubject, Observable, of, Subscriber } from "rxjs";
import { catchError, share } from "rxjs/operators";
import * as esriGeo from "esri-leaflet-geocoder";

type EntityResponseType = HttpResponse<FarmResponseModel>;
@Injectable({
  providedIn: "root",
})
export class FarmService {
  private geocodeLocationMap = new Map();
  private apiUrl = environment.apiUrl;
  private farmSubject = new BehaviorSubject<Farm>(
    JSON.parse(window.sessionStorage.getItem("farm"))
  );
  currentFarm = this.farmSubject.asObservable();

  constructor(private _http: HttpClient) {}

  get selectedFarm() {
    if (this.farmSubject) {
      return this.farmSubject.getValue();
    }
  }

  public createFarm(farm: any): Observable<any> {
    return this._http.post(`${this.apiUrl}/api/upr/farms`, farm, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.h2020ipmdecisions.hateoas+json",
      },
      observe: "response",
    });
  }

  public getFarms(params?: string[]): Observable<FarmResponseModel> {
    return this._http
      .get(`${this.apiUrl}/api/upr/farms`, {
        headers: {
          Accept: "application/vnd.h2020ipmdecisions.hateoas+json",
        },
      })
      .pipe(
        share(),
        catchError((error) => {
          return of(error);
        })
      );
  }

  public find(id: string): Observable<EntityResponseType> {
    return this._http.get<FarmResponseModel>(`${this.apiUrl}/api/upr/farms/${id}`, { headers:{Accept: "application/vnd.h2020ipmdecisions.hateoas+json"}, observe: 'response' });
  }

  public updateFarm(operations: Operation[]): Observable<HttpResponse<any>> {
    return this._http.patch(
      `${this.apiUrl}/api/upr/farms/${this.selectedFarm.id}`,
      operations,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        observe: "response",
      }
    );
  }

  public updateFarmByFarm(operations: Operation[], farm: Farm): Observable<HttpResponse<any>> {
    return this._http.patch(
      `${this.apiUrl}/api/upr/farms/${farm.id}`,
      operations,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        observe: "response",
      }
    );
  }

  public deleteFarm(farmId: string): Observable<HttpResponse<any>> {
    return this._http
      .delete(`${this.apiUrl}/api/upr/farms/${farmId}`, {
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

  public getAddressFromCoordinates(latitude: number, longitude: number):Observable<any>{
    return new Observable( (observer:Subscriber<any>)=>{
      const key = latitude+"-"+longitude;
      const previousVal = this.geocodeLocationMap.get(key);
      if(previousVal){
        observer.next(previousVal);
        observer.complete();
        return;
      }
      esriGeo
        .geocodeService()
        .reverse()
        .latlng({ lat: latitude, lng: longitude })
        .run(function (error, result) {
          if (result) {
            this.geocodeLocationMap.set(key,result.address);
            observer.next(result.address);
          }
          observer.complete();
        }.bind(this))
    })
  }

}
