import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";
import { FarmService } from "./farm.service";

@Injectable({
  providedIn: "root",
})
export class FieldCropDecisionCombinationService {
  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient, private _farmService: FarmService) {}

  // Associate a Crop Decisions To a Field
  public assocCropDecisionToField(fieldId: string): Observable<any> {
    let url = `${this.apiUrl}/api/upr/fields/${fieldId}/cropdecisions`;
    return this._http.post(
      url,
      { CropDecisionCombinatioId: fieldId },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  // Get Crop Decisions From Field
  public getCropDecisionsFromField(
    fieldId: string,
    param?: string[]
  ): Observable<any> {
    let url = `${this.apiUrl}/api/upr/fields/${fieldId}/cropdecisions`;

    if (param) {
      url += `pageSize,pageNumber`;
    }

    return this._http.get(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }
}

interface FCDCombination {
  id: string;
  Crop: Crop;

  PestId: Pest;

  Dss: string;
}

interface Crop {
  id: string;
  inf1: string;
  inf2: string;
  deprecated: boolean;
}

interface Pest {
  id: string;
  inf1: string;
  inf2: string;
  deprecated: boolean;
}
