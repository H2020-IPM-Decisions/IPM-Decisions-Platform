import { DssGroupedByFarm, DssGroupedByCrops } from './../../../shared/models/dssGroupedByFarm.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from "@src/environments/environment";
import { IDssFlat, IDssFormData, DssJSONSchema, DssModel, DssSelection, IDssResultChart, DssParameters, IDssParameters } from './dss-selection.model';
import { Field } from '@app/shared/models/field.model';
import { Farm } from '@app/shared/models/farm.model';
import { catchError } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";

@Injectable({ providedIn: 'root' })
export class DssSelectionService {
  constructor(
    protected _http: HttpClient,
    private _logger: NGXLogger
  ) { }

  // https://ipmdecisions.nibio.no/api/dss/apidocs/resource_DSSService.html#resource_DSSService_getDSSModelUIFormSchema_GET

  getDssByCropAndPest(crop: string, pest: string): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/dss/crop/${crop}/pest/${pest}`
    return this._http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getDssByMultipleCrops(crops: string): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/dss/crops/${crops}`+"/platform_validated/true"
    return this._http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getSchemaByDssAndModel(dss: DssSelection, model: DssModel): Observable<HttpResponse<DssJSONSchema>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/model/${dss.id}/${model.id}/input_schema/ui_form`;
    return this._http.get<DssJSONSchema>(requestUrl, { observe: 'response' });
  }

  getSchemaByDssIdAndModelId(dssId: string, modelId: string): Observable<HttpResponse<DssJSONSchema>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/model/${dssId}/${modelId}/input_schema/ui_form`;
    return this._http.get<DssJSONSchema>(requestUrl, { observe: 'response' });
  }

  getSchemaByDssId(dssId: string): Observable<HttpResponse<DssJSONSchema>> {
    const requestUrl = `${environment.apiUrl}/api/upr/dss/${dssId}/parameters`;
    return this._http.get<DssJSONSchema>(requestUrl, { observe: 'response' });
  }

  get(id: string): Observable<HttpResponse<IDssFlat>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/${id}`;
    return this._http.get<IDssFlat>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response'
    });
  }

  del(id: string): Observable<HttpResponse<IDssFlat>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/${id}`;
    return this._http.delete<IDssFlat>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response'
    });
  }

  getDssList(): Observable<HttpResponse<IDssFlat[]>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss`;
    return this._http.get<IDssFlat[]>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response'
    });
  }

  getDssMap(dssList: IDssFlat[]): Map<string, IDssFlat[]> {
    let dssMap: Map<string, IDssFlat[]> = new Map<string, IDssFlat[]>();
    for (const element of dssList) {
      let array: IDssFlat[] = [];
      if (dssMap.has(element.cropEppoCode)) {
        array = dssMap.get(element.cropEppoCode);
      }
      array.push(element);
      dssMap.set(element.cropEppoCode, array);
    }
    return dssMap;
  };

  getDssGroupedByFarms(dssList: IDssFlat[]): DssGroupedByFarm[] {
    let groupedDssModels: DssGroupedByFarm[] = [];

    let farmMap: Map<string, IDssFlat[]> = new Map<string, IDssFlat[]>();
    //let result: Map<string, Map<string, IDssFlat[]>> = new Map<string, Map<string, IDssFlat[]>>();

    for (const element of dssList) {
      let array: IDssFlat[] = [];
      if (farmMap.has(element.farmId)) {
        array = farmMap.get(element.farmId);
      }
      array.push(element);
      farmMap.set(element.farmId, array);
    }

    for (let [farmId, dssModels] of farmMap) {
      let farmName: string;
      let dssMap: Map<string, IDssFlat[]> = new Map<string, IDssFlat[]>();

      for (let dss of dssModels) {
        farmName = dss.farmName;
        let cropDssModels: IDssFlat[] = [];
        if (dssMap.has(dss.cropEppoCode)) {
          cropDssModels = dssMap.get(dss.cropEppoCode);
        }
        cropDssModels.push(dss);
        dssMap.set(dss.cropEppoCode, cropDssModels);
      }

      let cropsDss: DssGroupedByCrops[] = [];
      for (let [crop, dssArray] of dssMap) {
        cropsDss.push(new DssGroupedByCrops(crop, dssArray));
      }

      groupedDssModels.push(new DssGroupedByFarm(farmId, farmName, cropsDss));
    }
    return groupedDssModels;
  };

  submitDss(data: IDssFormData[], farm: Farm): Observable<HttpResponse<IDssFormData[]>> {
    let requestUrl = `${environment.apiUrl}/api/upr/farms/${farm.id}/dss`;
    return this._http.post<IDssFormData[]>(requestUrl, data, {
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
      dssModelVersion: model.version,
      dssExecutionType: model.execution.type,
      /*cropPest: {
        cropEppoCode: selectedCrop,
        pestEppoCode: selectedPest
      },*/
      dssParameters: JSON.stringify(jsonSchemaForm),
      cropEppoCode: selectedCrop,
      pestEppoCode: selectedPest,
      sowingDate: field.sowingDate
    }
  }

  getDssData(selectedCrop: string, selectedPest: string, dss: DssSelection, model: DssModel, jsonSchemaForm?: any): IDssFormData {
    let endpoint: string = "";
    if (model.execution.type === "LINK") {
      endpoint = model.execution.endpoint;
    }
    return {
      dssId: dss.id,
      dssName: dss.name,
      dssModelName: model.name,
      dssModelId: model.id,
      dssModelVersion: model.version,
      dssExecutionType: model.execution.type,
      dssEndPoint: endpoint,
      cropEppoCode: selectedCrop,
      pestEppoCode: selectedPest,
      dssParameters: JSON.stringify(jsonSchemaForm),
      dssVersion: dss.version
    }
  }

  /*getDssWarningChart(data: number[], startDateStr: string): { data: number[], labels: string[], chartInformation: IDssResultChart } {
    //                        'no-info'  'no-stat'  'no risk'  'med ris'  'hi risk'
    //                        'grey'     'blue'     'green'    'orange'   'red'
    const colors: string[] = ['#6c757d', '#16aaff', '#3ac47d', '#f7b924', '#d92550'];
    let startDate: Date = new Date(startDateStr);
    let dateStrArr: string[] = [];
    let colorStrArr: string[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i != 0) {
        startDate.setDate(startDate.getDate() + 1);
      }
      dateStrArr.push(startDate.toISOString().substr(0, 10))
      colorStrArr.push(colors[data[i]]);
    }
    return {
      data: data,
      labels: dateStrArr,
      chartInformation: {
        chartType: 'bar',
        color: colorStrArr,
        unit: 'warning level',
        defaultVisible: true,
        options: {
          scales: {
            y: {
              max: 4,
              min: 0,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      }
    };
  }*/

  getDssWarningChart(data: number[], dateLabels: string[]): { data: number[], labels: string[], chartInformation: IDssResultChart } {
    //                        'no-info'  'no-stat'  'no risk'  'med ris'  'hi risk'
    //                        'grey'     'blue'     'green'    'orange'   'red'
    const colors: string[] = ['#6c757d', '#16aaff', '#3ac47d', '#f7b924', '#d92550'];
    let colorStrArr: string[] = [];
    for (let i = 0; i < data.length; i++) {
      colorStrArr.push(colors[data[i]]);
    }
    return {
      data: data,
      labels: dateLabels,
      chartInformation: {
        chartType: 'bar',
        color: colorStrArr,
        unit: 'warning level',
        defaultVisible: true,
        options: {
          scales: {
            y: {
              max: 4,
              min: 0,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      }
    };
  }

  public updateDssParameters(dssId: string, dssParameters: DssParameters): Observable<HttpResponse<any>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/${dssId}`;
    return this._http.put(requestUrl, dssParameters, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: "response",
    });
  }

  public getDssParameters(dssId: string): Observable<IDssParameters> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/${dssId}/parameters`;
    return this._http.get<IDssParameters>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      }
    });
  }

  getDssToCompare(dssIdList: string[]): Observable<HttpResponse<IDssFlat[]>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dsscomparison`;
    let urlDssIds: string = "?";
    for(let i:number = 0; i< dssIdList.length; i++){
        urlDssIds = urlDssIds + "dssids="+dssIdList[i]+"&"
    }
    urlDssIds = urlDssIds.slice(0, -1)
    requestUrl = requestUrl + urlDssIds
    return this._http.get<IDssFlat[]>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response'
    });
  }
}
