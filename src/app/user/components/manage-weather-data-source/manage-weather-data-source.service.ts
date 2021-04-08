import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from "@src/environments/environment";
import { IManageWeatherDataSource } from './manage-weather-data-source.model';

type EntityResponseType = HttpResponse<IManageWeatherDataSource>;
type EntityArrayResponseType = HttpResponse<IManageWeatherDataSource[]>;

@Injectable({ providedIn: 'root' })
export class ManageWeatherDataSourceService {
  // public resourceUrl = `${environment.apiUrl}/api/upr/weather-data-source`;
  public resourceUrl = 'http://localhost:8888/settings';
  constructor(protected http: HttpClient) {}

  create(data: IManageWeatherDataSource): Observable<EntityResponseType> {
    return this.http.post<IManageWeatherDataSource>(this.resourceUrl, data, { observe: 'response' });
  }

  update(data: IManageWeatherDataSource): Observable<EntityResponseType> {
    return this.http.put<IManageWeatherDataSource>(`${this.resourceUrl}/${data.id}`, data, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IManageWeatherDataSource>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(): Observable<EntityArrayResponseType> {
    return this.http.get<IManageWeatherDataSource[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

}
