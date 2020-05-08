import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserClaimService {
  constructor(private http: HttpClient) { }

  addClaimToUser(id: string):Observable<any> {
    const url = `http://localhost:5000/idp/api/admin/users/${id}/claims`;

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
    const url = `http://localhost:5000/idp/api/admin/users/${id}/claims`;
    return this.http.get<any>(url, {
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json' 
      }
    });
  }

  deleteUserClaims(id: string):Observable<any> {
    const url = `http://localhost:5000/idp/api/admin/users/${id}/claims`;
    return this.http.get<any>(url, {      
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json' 
      }
    });
  }

  getOptions(id: string):Observable<any> {
    return this.http.options<any>(`http://localhost:5000/idp/api/admin/users/${id}/claims`);
  }

}
