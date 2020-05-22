import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserClaimService {
  constructor(private http: HttpClient) { }

  addClaimToUser(id: string):Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/users/${id}/claims`;

    return this.http.post<any>(url, {
      "type" : "UserAccessType",
      "value" : "Level1"
    },
    {
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json' 
      }
    });
  }
  
  getUserClaims(id: string):Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/users/${id}/claims`;
    return this.http.get<any>(url, {
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json' 
      }
    });
  }

  deleteUserClaims(id: string):Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/users/${id}/claims`;
    return this.http.get<any>(url, {      
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json' 
      }
    });
  }

  getOptions(id: string):Observable<any> {
    return this.http.options<any>(environment.apiUrl + `/api/idp/admin/users/${id}/claims`);
  }

}
