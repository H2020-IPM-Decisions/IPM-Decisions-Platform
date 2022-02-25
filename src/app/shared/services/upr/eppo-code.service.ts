import { IEppoCode } from '../../interfaces/eppo-code.interface';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@src/environments/environment";
import { defer, isObservable, Observable, of } from "rxjs";
import { first, map, mergeMap, shareReplay } from "rxjs/operators";
import { EppoCode } from '@app/shared/models/eppo-code.model';

@Injectable({
  providedIn: "root",
})
export class EppoCodeService {
    private apiUrl = environment.apiUrl;

    constructor(
        private _http: HttpClient
    ) {  }

    //Crops
    public sharedCrops$: Observable<any>;
    private httpGetCrops$ = this._http.get<IEppoCode>(`${this.apiUrl}/api/upr/eppocodes/crop`).pipe(
        map(ecodes => {
            return ecodes.eppoCodesDto.map(ecodeDto =>{
                for (let key in ecodeDto.languages) {
                    if(key === sessionStorage.getItem("selectedLanguage")) {
                        return new EppoCode(ecodeDto.eppoCode, ecodeDto.languages[key]);
                    } else {
                        return new EppoCode(ecodeDto.eppoCode, ecodeDto.languages["la"]);
                    }
                }
            });
        })
    );
    private createSharedCrops = () =>
    (this.sharedCrops$ = this.httpGetCrops$.pipe(
        shareReplay(1)
    ));
    public cachedRefreshableCrops$ = this.createSharedCrops().pipe(
        first(null, defer(() => this.createSharedCrops())),
        mergeMap(d => (isObservable(d) ? d : of(d)))
    );

    //Pests
    public sharedPests$: Observable<any>;
    private httpGetPests$ = this._http.get<IEppoCode>(`${this.apiUrl}/api/upr/eppocodes/pest`).pipe(
        map(ecodes => {
            return ecodes.eppoCodesDto.map(ecodeDto =>{
                for (let key in ecodeDto.languages) {
                    if(key === sessionStorage.getItem("selectedLanguage")) {
                        return new EppoCode(ecodeDto.eppoCode, ecodeDto.languages[key]);
                    } else {
                        return new EppoCode(ecodeDto.eppoCode, ecodeDto.languages["la"]);
                    }
                }
            });
        })
    );
    private createSharedPests = () =>
    (this.sharedPests$ = this.httpGetPests$.pipe(
        shareReplay(1)
    ));
    public cachedRefreshablePests$ = this.createSharedPests().pipe(
        first(null, defer(() => this.createSharedPests())),
        mergeMap(d => (isObservable(d) ? d : of(d)))
    );
}