import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from "@src/environments/environment";
import { DssSelection } from './dss-selection.model';

type CropListEntityResponseType = HttpResponse<string[]>;
type PestListEntityResponseType = HttpResponse<string[]>;
type DssSelectionListEntityResponseType = HttpResponse<DssSelection[]>;

@Injectable({ providedIn: 'root' })
export class DssSelectionService {
  public resourceUrl = `${environment.apiUrl}/api/dss/rest`;
  constructor(protected http: HttpClient) {}

  getCrops(): Observable<CropListEntityResponseType> {
    return this.http.get<string[]>(`${this.resourceUrl}/crop`, { observe: 'response' });
  }

  getPests(): Observable<PestListEntityResponseType> {
    return this.http.get<string[]>(`${this.resourceUrl}/pest`, { observe: 'response' });
  }

  getModels(crop?:string, pest?:string): Observable<DssSelectionListEntityResponseType> {
    let requestUrl = `${this.resourceUrl}/dss`;
    if(crop){
        requestUrl += `/crop/${crop}`;
    }
    if(pest){
        requestUrl += `/pest/${pest}`;
    }
    return this.http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

}
