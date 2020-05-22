  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { catchError } from 'rxjs/operators';
  import { Observable } from 'rxjs';
  import { environment } from 'src/environments/environment';
  
  @Injectable({
    providedIn: 'root'
  })
  export class UserService {
  
    constructor(private http: HttpClient) { }
    getAllUsers():Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        headers: {
          'Accept':'application/json'
        }
      });
    }
  
    getAllUsersWithHATEOASLinks():Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        headers: {
          'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
        }
      });
    }
  
    getAllUserWithSearchQuery(searchquery: string):Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        params: {
          searchquery: searchquery
        },
        headers: {
          'Accept':'application/json'
        }
      });
    }
  
    getEnabledApplicationClients(fields: string):Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        params: {
          fields: fields
        },
        headers: {
          'Accept':'application/json'
        }
      });
    }
  
    getAllUsersOrderBy(orderby:string):Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        params: {
          orderby: orderby
        },
        headers: {
          'Accept':'application/json'
        }
      });
    }
  
    getAllUsersOrderByDesc(orderby:string):Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        params: {
          orderby: `${orderby} desc`
        },
        headers: {
          'Accept':'application/json'
        }
      });
    }
    getAllUsersWithPageParams(pageSize, pageNumber):Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        params: {
          pageSize: pageSize,       
          pageNumber: pageNumber   
        },
        headers: {
          'Accept':'application/json'
        }
      });
    }
  
    getAllUsersWithParams(PageSize, pageNumber, searchquery, IsEnabled, fields, orderby):Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        params: {
          PageSize: PageSize,       
          pageNumber: pageNumber,   
          searchquery: searchquery,   
          IsEnabled: IsEnabled,   
          fields: fields,  
          orderby: orderby  
        },
        headers: {
          'Accept':'application/json'
        }
      });
    }
  
    getAllUsersWithParamsHATEOAS(PageSize, pageNumber, searchquery, IsEnabled, fields, orderby):Observable<any> {
      const url = environment.apiUrl + '/api/idp/admin/users';
      return this.http.get<any>(url, {
        params: {
          PageSize: PageSize,       
          pageNumber: pageNumber,   
          searchquery: searchquery,   
          IsEnabled: IsEnabled,   
          fields: fields,  
          orderby: orderby  
        },
        headers: {
          'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
        }
      });
    }
  
    getAllUserById(id:string):Observable<any> {
      const url = environment.apiUrl + `/api/idp/admin/users/${id}`;
      return this.http.get<any>(url, {
        headers: {
          'Accept':'application/json'
        }
      });
    } 
     
    getAllUserByIdHATEOAS(id:string, fields:string):Observable<any> {
      const url = environment.apiUrl + `/api/idp/admin/users/${id}`;
      return this.http.get<any>(url, {
        params: {
          fields: fields  
        },
        headers: {
          'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
        }
      });
    }
  
    deleteUser(id:string):Observable<any> {
      const url = environment.apiUrl + `/api/idp/admin/users/${id}`;
  
      return this.http.delete<any>(url, {
        headers: {
          'Accept':'application/json'
        }
      });
    }
  }
  
