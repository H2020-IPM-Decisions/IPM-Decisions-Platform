import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";


@Injectable({ providedIn: 'root' })
export class CustomFieldService {
    constructor(protected http: HttpClient) { }

    getCrops(): Observable<{ value: any, label: any }[]> {
        const requestUrl = `${environment.apiUrl}/api/dss/rest/crop`;
        return this.http.get(requestUrl, {observe: 'response'})
            .pipe(
                map( (data:HttpResponse<any[]>) => { 
                    const filtered = data.body.filter((value, index) => data.body.indexOf(value) === index).sort();
                    return filtered.map((item) => ({ value: item, label: item }));
                }
            ));
    }
    
    getPests(): Observable<{ value: any, label: any }[]> {
        const requestUrl = `${environment.apiUrl}/api/dss/rest/pest`;
        return this.http.get(requestUrl, {observe: 'response'})
            .pipe(
                map( (data:HttpResponse<any[]>) => { 
                    const filtered = data.body.filter((value, index) => data.body.indexOf(value) === index).sort();
                    return filtered.map((item) => ({ value: item, label: item }));
                }
            ));
    }
    
}