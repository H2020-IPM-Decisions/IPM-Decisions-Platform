import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from "@src/environments/environment";
import { IDssFlat, IDssFormData, DssJSONSchema, DssModel, DssSelection } from './dss-selection.model';
import { Field } from '@app/shared/models/field.model';
import { Farm } from '@app/shared/models/farm.model';

type CropListEntityResponseType = HttpResponse<string[]>;
type PestListEntityResponseType = HttpResponse<string[]>;

@Injectable({ providedIn: 'root' })
export class DssSelectionService {
  constructor(protected http: HttpClient) { }

  // https://ipmdecisions.nibio.no/api/dss/apidocs/resource_DSSService.html#resource_DSSService_getDSSModelUIFormSchema_GET

  getDssByCropAndPest(crop: string, pest: string): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/dss/crop/${crop}/pest/${pest}`
    return this.http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getSchemaByDssAndModel(dss: DssSelection, model: DssModel): Observable<HttpResponse<DssJSONSchema>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/model/${dss.id}/${model.id}/input_schema/ui_form`;
    return this.http.get<DssJSONSchema>(requestUrl, { observe: 'response' });
  }

  get(id: string):Observable<HttpResponse<IDssFlat>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/${id}`;
    return this.http.get<IDssFlat>(requestUrl, { 
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response' 
    });
  }

  del(id: string):Observable<HttpResponse<IDssFlat>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/${id}`;
    return this.http.delete<IDssFlat>(requestUrl, { 
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response' 
    });
  }

  getDssList():Observable<HttpResponse<IDssFlat[]>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss`;
    return this.http.get<IDssFlat[]>(requestUrl, { 
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response' 
    });
  }

  getDssMap(dssList: IDssFlat[]):Map<string, IDssFlat[]>{
    let dssMap: Map<string, IDssFlat[]> = new Map<string, IDssFlat[]>();
    for (const element of dssList) {
      let array: IDssFlat[] = [];
      if(dssMap.has(element.cropEppoCode)){
        array = dssMap.get(element.cropEppoCode);
      } 
      array.push(element);
      dssMap.set(element.cropEppoCode, array);
    }
    return dssMap;
  };

  submitDss(data: IDssFormData, farm: Farm): Observable<HttpResponse<IDssFormData>> {
    let requestUrl = `${environment.apiUrl}/api/upr/farms/${farm.id}/dss`;
    return this.http.post<IDssFormData>(requestUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: "response",
    });
  }

  getFormData(field: Field, selectedCrop: string, selectedPest: string, dss: DssSelection, model: DssModel, jsonSchemaForm: any): IDssFormData {
    return {
      fieldId: field.id,
      fieldName: field.name,
      dssId: dss.id,
      dssName: dss.name,
      dssModelName: model.name,
      dssModelId: model.id,
      dssVersion: model.version,
      dssExecutionType: model.execution.type,
      cropPest: {
        cropEppoCode: selectedCrop,
        pestEppoCode: selectedPest
      },
      dssParameters: JSON.stringify(jsonSchemaForm)
    }
  }

}
