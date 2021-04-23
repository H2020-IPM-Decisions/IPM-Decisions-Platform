import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from "@src/environments/environment";
import { DssFormData, DssJSONSchema, DssModel, DssSelection } from './dss-selection.model';
import { Field } from '@app/shared/models/field.model';
import { Farm } from '@app/shared/models/farm.model';

type CropListEntityResponseType = HttpResponse<string[]>;
type PestListEntityResponseType = HttpResponse<string[]>;

@Injectable({ providedIn: 'root' })
export class DssSelectionService {
  public resourceUrl = `${environment.apiUrl}/api/upr`;
  constructor(protected http: HttpClient) { }

  // https://ipmdecisions.nibio.no/api/dss/apidocs/resource_DSSService.html#resource_DSSService_getDSSModelUIFormSchema_GET

  getDssByCropAndPest(crop: string, pest: string): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `https://ipmdecisions.nibio.no/api/dss/rest/dss/crop/${crop}/pest/${pest}`
    return this.http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getSchemaByDssAndModel(dss: DssSelection, model: DssModel): Observable<HttpResponse<DssJSONSchema>> {
    const requestUrl = `https://ipmdecisions.nibio.no/api/dss/rest/model/${dss.id}/${model.id}/input_schema/ui_form`;
    return this.http.get<DssJSONSchema>(requestUrl, { observe: 'response' });
  }

  submitDss(data: DssFormData, farm: Farm): Observable<HttpResponse<DssFormData>> {
    let requestUrl = `${this.resourceUrl}/farms/${farm.id}/dss`;
    return this.http.post<DssFormData>(requestUrl, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: "response",
    });
  }

  getFormData(field: Field, selectedCrop: string, selectedPest: string, dss: DssSelection, model: DssModel, jsonSchemaForm: any): DssFormData {
    return {
      fieldId: field.id,
      fieldName: field.name,
      dssId: dss.id,
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
