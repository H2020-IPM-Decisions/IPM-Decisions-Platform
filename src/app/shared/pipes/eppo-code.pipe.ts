import { Pipe, PipeTransform } from '@angular/core';
import { EppoCodeService } from "@app/shared/services/upr/eppo-code.service";
import { EppoCode } from "@app/shared/models/eppo-code.model";

@Pipe({name: 'eppoCode',pure: false})
export class EppoCodePipe implements PipeTransform {
  constructor(private _eppoCodeService: EppoCodeService){}
  transform(code: string): string {
    let EppoCodes: EppoCode[] = [];
    this._eppoCodeService.cachedRefreshableCrops$.subscribe(data=>{
      EppoCodes.push(...data);}
    );
    this._eppoCodeService.cachedRefreshablePests$.subscribe(data=>{
      EppoCodes.push(...data);}
    );
    let cropByCode: EppoCode;
    cropByCode = EppoCodes.find(element => element.code === code);
    cropByCode = (cropByCode === undefined) ? new EppoCode(code,"",code) : cropByCode;
    if(!(cropByCode.en === "")){
      return cropByCode.en;
    } 
    if(!(cropByCode.la === "")){
      return cropByCode.la;
    }
    return cropByCode.code;
  }
}