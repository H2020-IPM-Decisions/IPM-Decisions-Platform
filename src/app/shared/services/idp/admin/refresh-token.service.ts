import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(private http: HttpClient) { }
  getRefreshTokens():Observable<any> {
    const url = environment.apiUrl + '/api/idp/admin/refreshtokens';

    return this.http.get<any>(url, {     
      headers: {
        'Accept':'application/json'
      }
    });
  }  
  getRefreshTokensHATEOAS(fields:string):Observable<any> {
    const url = environment.apiUrl + '/api/idp/admin/refreshtokens';
    
    return this.http.get<any>(url, {  
      params: {
        fields: fields
      },   
      headers: {
        'Accept':'application/json'
      }
    });
  }
  getRefreshTokensWithPageSize(pageSize:string, pagenumber:string):Observable<any> {
    const url = environment.apiUrl + '/api/idp/admin/refreshtokens';
    
    return this.http.get<any>(url, {      
      headers: {
        'Accept':'application/json'
      },
      params: {
        pageSize: pageSize,
        pagenumber: pagenumber
      }
    });
  }
  getRefreshTokensParams(pageSize:string, pagenumber:string, fields:string):Observable<any> {
    const url = environment.apiUrl + '/api/idp//admin/refreshtokens';
    
    return this.http.get<any>(url, {  
      params: {
        pageSize: pageSize,
        pagenumber: pagenumber,
        fields: fields
      },   
      headers: {
        'Accept':'application/json'
      }
    });
  }
  getRefreshTokensParamsHATEOAS(pageSize:string, pagenumber:string, fields:string):Observable<any> {
    const url = environment.apiUrl + '/api/idp/admin/refreshtokens';
    
    return this.http.get<any>(url, {  
      params: {
        pageSize: pageSize,
        pagenumber: pagenumber,
        fields: fields
      },   
      headers: {
        'Accept':'application/json'
      }
    });
  }
  getRefreshTokensParamsById(id:string):Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/refreshtokens/${id}`;

    return this.http.get<any>(url, {
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getRefreshTokensParamsByIdWithFieldsParam(id:string, fields:string):Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/refreshtokens/${id}`;

    return this.http.get<any>(url, {
      params: {
        fields: fields
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getRefreshTokensParamsByIdWithParamsHATEOAS(id:string, fields:string):Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/refreshtokens/${id}`;
    return this.http.get<any>(url, {
      params: {
        fields: fields  
      },
      headers: {
        'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
      }
    });
  }

  deleteRefreshToken(id:string):Observable<any> {
    const url = environment.apiUrl + `/api/idp/admin/refreshtokens/${id}`;
    return this.http.delete<any>(url);
  }
  
}