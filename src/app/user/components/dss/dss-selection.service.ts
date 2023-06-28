import { DssGroupedByFarm, DssGroupedByCrops } from './../../../shared/models/dssGroupedByFarm.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from "@src/environments/environment";
import { IDssFlat, IDssFormData, DssJSONSchema, DssModel, DssSelection, IDssResultChart, DssParameters, IDssParameters, IDssForAdaptation } from './dss-selection.model';
import { Field } from '@app/shared/models/field.model';
import { Farm } from '@app/shared/models/farm.model';
import { catchError } from "rxjs/operators";
import { NGXLogger } from "ngx-logger";
import { TranslationService } from '@app/shared/services/translation.service';

@Injectable({ providedIn: 'root' })
export class DssSelectionService {
  constructor(
    protected _http: HttpClient,
    private _logger: NGXLogger,
    private _translation: TranslationService
  ) { }

  // https://ipmdecisions.nibio.no/api/dss/apidocs/resource_DSSService.html#resource_DSSService_getDSSModelUIFormSchema_GET

  getDssByCropAndPest(crop: string, pest: string): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/dss/crop/${crop}/pest/${pest}`
    return this._http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getDss(): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/dss`
    return this._http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getDssByMultipleCrops(crops: string): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/dss/crops/${crops}`
    return this._http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getDssByMultipleCropsAndPlatformValidated(crops: string): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/dss/crops/${crops}`+ "/platform_validated/true"
    return this._http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getDssByMultipleCropsAndFarmLocation(crops: string, lat: number, lon: number): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/upr/dss/filter?cropCodes=${crops}&LocationLongitude=${lon}&LocationLatitude=${lat}&executionType=ONTHEFLY`;
    return this._http.get<DssSelection[]>(requestUrl, { observe: 'response' });
  }

  getDssByMultipleCropsAndFarmLocationFilteredByCountry(crops: string, lat: number, lon: number, country: string): Observable<HttpResponse<DssSelection[]>> {
    const requestUrl = `${environment.apiUrl}/api/upr/dss/filter?cropCodes=${crops}&LocationLongitude=${lon}&LocationLatitude=${lat}&executionType=ONTHEFLY&country=${country}`;
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

  getDefaultParameters(dssId: string): Observable<HttpResponse<string>> {
    const requestUrl = `${environment.apiUrl}/api/upr/dss/${dssId}/defaultparameters`;
    return this._http.get<string>(requestUrl, { observe: 'response' });
  }

  getCountries(): Observable<HttpResponse<string[]>> {
    const requestUrl = `${environment.apiUrl}/api/dss/rest/countries`;
    return this._http.get<string[]>(requestUrl, { observe: 'response' });
  }

  get(id: string, days: number): Observable<HttpResponse<IDssFlat>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/${id}?days=${days}`;
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

  getLinkedDssList(): Observable<HttpResponse<DssSelection[]>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/filter?executionType=LINK&DisplayIsSavedByUser=true`;
    return this._http.get<DssSelection[]>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response'
    });
  }

  getLinkedDssListByMultipleCrops(crops: string): Observable<HttpResponse<DssSelection[]>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/filter?cropCodes=${crops}`+"&executionType=LINK&DisplayIsSavedByUser=true"
    return this._http.get<DssSelection[]>(requestUrl, {
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

  submitLinkedDssWithoutFarmId(data: IDssFormData[]): Observable<HttpResponse<IDssFormData[]>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dss/links`;
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
  
  convertDssSelectionModelToDssFlat(dss: DssSelection): IDssFlat[] {
    let resultDssList: IDssFlat [] = [];
    dss.models.forEach((model) => {
      this._logger.debug("MODEL",model);
      let dssFlatData: IDssFlat = {
        alreadySavedByUser: model.alreadySavedByUser,
        authors: model.authors,
        cropEppoCode: model.crops[0],
        dssDescription: model.description,
        dssDatabaseId: model.dssDatabaseId,
        dssEndPoint: model.description_URL,
        dssExecutionType: model.execution.type,
        dssId: dss.id,
        dssLogoUrl: dss.logo_url,
        dssModelId: model.id,
        dssModelName: model.name,
        dssModelVersion: model.version,
        dssName: dss.name,
        dssPurpose: dss.purpose,
        dssSource: dss.organization.name +" "+ dss.organization.country,
        dssVersion: dss.version,
        pestEppoCode: model.pests[0]
      }
      
      resultDssList.push(dssFlatData);
    })
    return resultDssList;
  }

  getDssDataFromDssFlat(dssModelFlat: IDssFlat): IDssFormData {
    return {
      dssId: dssModelFlat.dssId,
      dssVersion: dssModelFlat.dssVersion,
      dssName: dssModelFlat.dssName,
      dssModelName: dssModelFlat.dssModelName,
      dssModelId: dssModelFlat.dssModelId,
      dssModelVersion: dssModelFlat.dssModelVersion,
      pestEppoCode: dssModelFlat.pestEppoCode,
      cropEppoCode: dssModelFlat.cropEppoCode,
      dssExecutionType: dssModelFlat.dssExecutionType
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
    const unitLabel: string = this._translation.getTranslatedMessage("Common_labels.Warning_level");
    const lowLabel: string = this._translation.getTranslatedMessage("Common_labels.Low");
    const mediumLabel: string = this._translation.getTranslatedMessage("Common_labels.Medium");
    const highLabel: string = this._translation.getTranslatedMessage("Common_labels.High");
    for (let i = 0; i < data.length; i++) {
      colorStrArr.push(colors[data[i]]);
    }
    return {
      data: data,
      labels: dateLabels,
      chartInformation: {
        chartType: 'bar',
        color: colorStrArr,
        unit: unitLabel,
        defaultVisible: true,
        options: {
          animation: true,
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true
                },
                pinch: {
                  enabled: true
                },
                mode: 'xy'
              },
              pan: {
                enabled: true,
                mode: 'xy',
                threshold: 5
              }
            },
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem){
                        var label = tooltipItem.dataset.label;
                        var value = tooltipItem.dataset.data[tooltipItem.dataIndex];
                        switch (value) {
                            case 2:
                                return label + ": "+lowLabel;
                            case 3:
                                return label + ": "+mediumLabel;
                            case 4:
                                return label + ": "+highLabel;
                        } 
                    }
                }
            }
          },
          scales: {
            y:{
                min: 1,
                max: 4,
                beginAtZero: false,
                stepSize: 1,
                ticks: {
                    callback: function(label, index, labels) {
                        switch (label) {
                            case 2:
                              return lowLabel;
                            case 3:
                              return mediumLabel;
                            case 4:
                              return highLabel;
                        }
                    }
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

  getDssToCompare(dssIdList: string[], days: number): Observable<HttpResponse<IDssFlat[]>> {
    let requestUrl = `${environment.apiUrl}/api/upr/dsscomparison`;
    let urlDssIds: string = "?";
    for(let i:number = 0; i< dssIdList.length; i++){
        urlDssIds = urlDssIds + "dssids="+dssIdList[i]+"&"
    }
    urlDssIds = urlDssIds.slice(0, -1)
    requestUrl = requestUrl + urlDssIds + `&days=${days}`
    return this._http.get<IDssFlat[]>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response'
    });
  }

  public getDssToAdapt(dssId: string): Observable<HttpResponse<IDssForAdaptation>>{ 
    let requestUrl = `${environment.apiUrl}/api/upr/adaptation/${dssId}?days=30`;
    return this._http.get<IDssForAdaptation>(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: 'response'
    });
  }

  public sendDssParametersForAdaptation(dssId: string, dssParameters: DssParameters): Observable<HttpResponse<any>> {
    let requestUrl = `${environment.apiUrl}/api/upr/adaptation/${dssId}`;
    return this._http.post(requestUrl, dssParameters, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: "response",
    });
  }  

  public getDssAdaptationRevisedData(dssId: string, taskId: string): Observable<HttpResponse<any>> {
    let requestUrl = `${environment.apiUrl}/api/upr/adaptation/${dssId}/task?id=${taskId}`;
    return this._http.get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      observe: "response",
    });
  }
}
