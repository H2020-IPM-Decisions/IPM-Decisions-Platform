import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Operation } from 'fast-json-patch';

import { environment } from 'src/environments/environment';
import { User } from '@app/core/auth/models/user.model';
import { UserProfile } from '../../models/user-profile.model';
import { UserProfileForCreation } from '../../models/user-profile-for-creation.model';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private http: HttpClient) { }

  getUserProfile(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/api/upr/users/${id}/profiles`, {
      headers: { 
        'Content-Type': 'application/json',    
        'Accept': 'application/json' 
      }
        // Accept values should be 'application/json' or 'application/vnd.h2020ipmdecisions.hateoas+json'
    });
  }

  createUserProfile(id: string, userForCreation: UserProfileForCreation) {
    const url = `${environment.apiUrl}/api/upr/users/${id}/profiles`;
    const headers = { 
      'Accept':'application/json',
      'Content-Type':'application/json'
    };

    return this.http.post(url, userForCreation, {headers})
    .pipe(catchError(this.handleError));
  }

  updateUserProfile(id: string, operations: Operation[]) {
    const url = `${environment.apiUrl}/api/upr/users/${id}/profiles`;
    const headers = { 
      'Content-Type':'application/json-patch+json'
    };

    return this.http.patch(url, operations, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  deleteUserProfile(id: string) {
    const url = `${environment.apiUrl}/api/upr/users/${id}/profiles`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {

    let errorMessage = 'An unknown error occured!';
    if(!errorRes.error || !errorRes.error.message) {
        return throwError(errorMessage);
    }
    return throwError(errorRes.error.message);
  }
}


