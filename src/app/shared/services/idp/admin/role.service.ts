import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  getAllRoles():Observable<any> {
    const url = 'http://localhost:5000/idp/api/admin/roles';
    return this.http.get<any>(url, {
      headers: {
        'Accept':'application/json;' 
      }
    });
  }

  getAllRolesFields(fields: string):Observable<any> {
    const url = 'http://localhost:5000/idp/api/admin/roles';

    return this.http.get<any>(url, {
      params: {
        fields: fields
      },
      headers: {
        'Accept':'application/json;'
      }
    });
  }

  getAllRolesHATEOAS():Observable<any> {
    const url = 'http://localhost:5000/idp/api/admin/roles';
    return this.http.get<any>(url, {      
      headers: {
        'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
      }
    });
  }

  getAllRolesFieldsWithHATEOAS(fields: string):Observable<any> {
    const url = 'http://localhost:5000/idp/api/admin/roles';
    return this.http.get<any>(url, {
      params: {
        fields: fields
      },
      headers: {
        'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
      }
    });
  }

  createRole():Observable<any> {
    const url = 'http://localhost:5000/idp/api/admin/roles';
    return this.http.post<any>(url, {
      body: {
        "name" : "Role1"
      },
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    });
  }
  createRoleHATEOAS():Observable<any> {
    const url = 'http://localhost:5000/idp/api/admin/roles';
    return this.http.post<any>(url, {
      body: {
        "name" : "Role1"
      },
      headers: {
        'Accept':'application/vnd.h2020ipmdecisions.hateoas+json',
        'Content-Type':'application/json'
      }
    });
  }
  getRoleById(id: string):Observable<any> {
    const url = `http://localhost:5000/idp/api/admin/roles/${id}`;
    return this.http.get<any>(url, {
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getRoleByIdFields(id: string, fields: string):Observable<any> {
    const url = `http://localhost:5000/idp/api/admin/roles/${id}`;

    return this.http.get<any>(url, {
      params: {
        fields: fields
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getRoleByIdFieldsHATEOAS(id: string, fields: string):Observable<any> {
    const url = `http://localhost:5000/idp/api/admin/roles/${id}`;

    return this.http.get<any>(url, {
      params: {
        fields: fields
      },
      headers: {
        'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
      }
    });
  }

  deleteRole(id: string):Observable<any> {
    const url = `http://localhost:5000/idp/api/admin/roles/${id}`;

    return this.http.get<any>(url);
  }
}
