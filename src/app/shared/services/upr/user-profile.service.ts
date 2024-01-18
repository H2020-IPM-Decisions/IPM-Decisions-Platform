import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Operation } from "fast-json-patch";

import { environment } from "src/environments/environment";
import { USER_PROFILE } from "@app/mock/user-profile.mock";
import { ADVISORS_EMAIL_LIST } from "./../../../mock/advisors-emial-list.mock";
import { UserProfileForUpdate } from '@app/shared/models/user-profile-for-update.model';
import { UserProfile } from '@app/shared/models/user-profile.model';
import { AvailableWeatherStation, UserWeatherStation, UserWeatherStationInfo, UserWeatherStationUpdate } from "@app/shared/models/weather-data-source.model";

@Injectable({
  providedIn: "root",
})
export class UserProfileService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getUserProfileMock(): any {
    return USER_PROFILE;
  }
  getAdvosorsEmailListMock(): any {
    return ADVISORS_EMAIL_LIST;
  }

  getUserProfile(friendly: boolean): Observable<UserProfile | UserProfileForUpdate> {
    return this.http.get<UserProfileForUpdate>(`${this.apiUrl}/api/upr/users/profiles`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": friendly ? "application/vnd.h2020ipmdecisions.profile.friendly.hateoas+json" : "application/vnd.h2020ipmdecisions.profile.full+json"
      },
    });
  }

  // createUserProfile(id: string, userForCreation: UserProfileForCreation) {
  //   const url = `${environment.apiUrl}/api/upr/users/${id}/profiles`;
  //   const headers = {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   };

  //   return this.http
  //     .post(url, userForCreation, { headers })
  //     .pipe(catchError(this.handleError));
  // }

  updateUserProfile(operations: Operation[]) {
    const url = `${this.apiUrl}/api/upr/users/profiles`;
    const headers = {
      "Content-Type": "application/json-patch+json",  
    };

    return this.http
      .patch(url, operations, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteUserProfile(id: string) {
    const url = `${environment.apiUrl}/api/upr/users/${id}/profiles`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    // let errorMessage = "An unknown error occured!";
    // if (!errorRes.error || !errorRes.error.message) {
    //   return throwError(errorMessage);
    // }
    return throwError(errorRes);
  }

  getAvailableWeatherStation(): Observable<HttpResponse<AvailableWeatherStation[]>>{
    const url = `${environment.apiUrl}/api/upr/weather`;
    return this.http.get<AvailableWeatherStation[]>(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      observe: "response",
    });
  }

  addWeatherStationToUser(body: UserWeatherStation): Observable<HttpResponse<any>>{
    const url = `${environment.apiUrl}/api/upr/users/weather`;
    return this.http.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      observe: "response",
    });
  }

  updateUserWeatherStation(body: UserWeatherStationUpdate, id: string): Observable<HttpResponse<UserWeatherStationUpdate>>{
    const url = `${environment.apiUrl}/api/upr/users/weather/${id}`;
    return this.http.put<UserWeatherStationUpdate>(url, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      observe: "response",
    });
  }

  deleteUserWeatherStation(id: string): Observable<HttpResponse<any>>{
    const url = `${environment.apiUrl}/api/upr/users/weather/${id}`;
    return this.http.delete(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      observe: "response",
    });
  }

  getAllUserWeatherStations(): Observable<HttpResponse<UserWeatherStationInfo[]>>{
    const url = `${environment.apiUrl}/api/upr/users/weather`;
    return this.http.get<UserWeatherStationInfo[]>(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      observe: "response",
    });
  }

  getUserWeatherStation(id: string): Observable<HttpResponse<UserWeatherStationInfo>>{
    const url = `${environment.apiUrl}/api/upr/users/weather/${id}`;
    return this.http.get<UserWeatherStationInfo>(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      observe: "response",
    });
  }


  addFarmsToWeatherStation(farmdIds: string [], weatherStationId: string): Observable<HttpResponse<any>>{
    const url = `${environment.apiUrl}/api/upr/users/weather/${weatherStationId}/farms`;
    return this.http.post(url, farmdIds, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      observe: "response",
    });
  }

  deleteFarmsFromWeatherStation(farmdIds: string [], weatherStationId: string): Observable<any>{
    const url = `${environment.apiUrl}/api/upr/users/weather/${weatherStationId}/farms`;
    const httpOptions = {
      headers: new HttpHeaders(
        { 
          'Content-Type': 'application/json',
          Accept: "application/json"
        }
      ), 
      body: farmdIds
    };
    return this.http.delete(url, httpOptions);
  }
  
}


