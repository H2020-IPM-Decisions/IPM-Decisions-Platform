import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Operation } from "fast-json-patch";

import { environment } from "src/environments/environment";
import { USER_PROFILE } from "@app/mock/user-profile.mock";
import { ADVISORS_EMAIL_LIST } from "./../../../mock/advisors-emial-list.mock";
import { UserProfileForUpdate } from '@app/shared/models/user-profile-for-update.model';

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

  getUserProfile(): Observable<UserProfileForUpdate> {
    return this.http.get<UserProfileForUpdate>(`${this.apiUrl}/api/upr/users/profiles`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.h2020ipmdecisions.profile.full+json",
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
}


