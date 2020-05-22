import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http: HttpClient) { }

  addRolesToUser(id: any): Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/users/${id}/roles`;

    return this.http.post<any>(url, [
      {
      "name" : "Admin"
      },
      {
      "name" : "ThisRoleDoNotExist"
      }
    ],
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
  }

  getUserRoles(id: string): Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/users/${id}/roles`;
    return this.http.get<any>(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
  }

  deleteUserClaims(id: string): Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/users/${id}/roles`;
    return this.http.delete<any>(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  getOptions(id: string): Observable<any> {
    return this.http.options<any>(environment.apiUrl + `/api/idp/admin/users/${id}/roles`);
  }

}
