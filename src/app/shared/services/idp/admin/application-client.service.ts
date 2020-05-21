import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ShapedDataWithLinksApplicationClients } from '@app/shared/models/ShapedDataWithLinksApplicationClients.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationClientService {

  constructor(private http: HttpClient) { }
  getApplicationClients(isEnabled, pageSize, orderBy, searchQuery, pageNumber, fields):Observable<ShapedDataWithLinksApplicationClients> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        isEnabled: isEnabled,
        pageSize: pageSize,
        orderBy: orderBy,
        searchQuery: searchQuery,
        pageNumber: pageNumber,
        fields: fields
      },
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json;' // or application/vnd.h2020ipmdecisions.hateoas+json'
      }
    });
  }

  getApplicationClientsWithHATEOASLinks(isEnabled, pageSize, orderBy, searchQuery, pageNumber, fields):Observable<ShapedDataWithLinksApplicationClients> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        isEnabled: isEnabled,
        pageSize: pageSize,
        orderBy: orderBy,
        searchQuery: searchQuery,
        pageNumber: pageNumber,
        fields: fields
      },
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
      }
    });
  }

  getApplicationClientWithSearchQuery(searchquery):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        searchquery: searchquery
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getEnabledApplicationClients(isEnabled):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        isEnabled: isEnabled
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }
  getApplicationClientsWithSearchQueryAndEnabled(searchquery, isEnabled):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        searchquery: searchquery,
        isEnabled: isEnabled
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getApplicationClientWithFields(fields):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        fields: fields
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getApplicationClientsOrderBy(orderby:string):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        orderby: orderby
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getApplicationClientsOrderByDesc(orderby:string):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        orderby: `${orderby} desc`
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }
  getApplicationClientsPageSizeAndPageNumber(PageSize, pageNumber):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        PageSize: PageSize,       
        pageNumber: pageNumber   
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getApplicationClientsWithAllOptions(PageSize, pageNumber, searchquery, IsEnabled, fields, orderby):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
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

  getApplicationClientsWithAllOptionsHATEOAS(PageSize, pageNumber, searchquery, IsEnabled, fields, orderby):Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients';
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
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

  getApplicationClientById(id:string):Observable<any> {
    const url = `http://localhost:5000/api/idp/admin/applicationclients/${id}`;
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getApplicationClientByIdWithParams(id:string, fields:string):Observable<any> {
    const url = `http://localhost:5000/api/idp/admin/applicationclients/${id}`;
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        fields: fields
      },
      headers: {
        'Accept':'application/json'
      }
    });
  }

  getApplicationClientByIdWithParamsHATEOAS(id:string, fields:string):Observable<any> {
    const url = `http://localhost:5000/api/idp/admin/applicationclients/${id}`;
    return this.http.get<ShapedDataWithLinksApplicationClients>(url, {
      params: {
        fields: fields  
      },
      headers: {
        'Accept':'application/vnd.h2020ipmdecisions.hateoas+json'
      }
    });
  }

  createApplicationClient():Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients/';
    return this.http.post<ShapedDataWithLinksApplicationClients>(url, {
        "name": "H2020 API Gateway 28",
          "applicationClientType": 1,
          "enabled": true,
          "refreshTokenLifeTime": 240,
          "url": "https://localhost:6001"
    },
    {     
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    });
  }
  createApplicationClientHATEOAS():Observable<any> {
    const url = 'http://localhost:5000/api/idp/admin/applicationclients/';
    return this.http.post<ShapedDataWithLinksApplicationClients>(url, {
        "name": "H2020 API Gateway 28",
          "applicationClientType": 1,
          "enabled": true,
          "refreshTokenLifeTime": 240,
          "url": "https://localhost:6001"
    },
    {     
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/vnd.h2020ipmdecisions.hateoas+json'
      }
    });
  }

  deleteApplicationClient(id:string):Observable<any> {
    const url = `http://localhost:5000/api/idp/admin/applicationclients/${id}`;

    return this.http.delete<ShapedDataWithLinksApplicationClients>(url, {
      // "name": "My Authorization Server",
      // "applicationClientType": 1,
      // "enabled": true,
      // "refreshTokenLifeTime": 10
    });
  }
}


// TODO: HAS MORE
