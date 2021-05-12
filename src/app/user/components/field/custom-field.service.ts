import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@src/environments/environment";
import { defer, isObservable, Observable, of } from "rxjs";
import { first, map, mergeMap, shareReplay } from "rxjs/operators";


@Injectable({ providedIn: 'root' })
export class CustomFieldService {
    constructor(protected http: HttpClient) { }

    public sharedCrops$: Observable<any>;
    private httpGetCrops$ = this.http.get(`${environment.apiUrl}/api/dss/rest/crop`, { observe: 'response' })
        .pipe(
            map((data: HttpResponse<any[]>) => {
                const filtered = data.body.filter((value, index) => data.body.indexOf(value) === index).sort();
                return filtered.map((item) => ({ value: item, label: item }));
            }
            ));
    private createSharedCrops = () =>
    (this.sharedCrops$ = this.httpGetCrops$.pipe(
        shareReplay(1, 60000)
    ));
    public cachedRefreshableCrops$ = this.createSharedCrops().pipe(
        first(null, defer(() => this.createSharedCrops())),
        mergeMap(d => (isObservable(d) ? d : of(d)))
    );

    public sharedPests$: Observable<any>;
    private httpGetPests$ = this.http.get(`${environment.apiUrl}/api/dss/rest/pest`, { observe: 'response' })
        .pipe(
            map((data: HttpResponse<any[]>) => {
                const filtered = data.body.filter((value, index) => data.body.indexOf(value) === index).sort();
                return filtered.map((item) => ({ value: item, label: item }));
            }
            ));
    private createSharedPests = () =>
    (this.sharedPests$ = this.httpGetPests$.pipe(
        shareReplay(1, 60000)
    ));
    public cachedRefreshablePests$ = this.createSharedPests().pipe(
        first(null, defer(() => this.createSharedPests())),
        mergeMap(d => (isObservable(d) ? d : of(d)))
    );

}