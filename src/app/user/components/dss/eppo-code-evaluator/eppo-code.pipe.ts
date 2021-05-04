import { Pipe, PipeTransform } from '@angular/core';
import CodesJson from './vocabulary.json';

@Pipe({name: 'eppoCode'})
export class EppoCodePipe implements PipeTransform {
  transform(code: string): string {
    let description = '';
    if(CodesJson.cropEppoCode[code]){
        description = CodesJson.cropEppoCode[code];
    }
    return description;
  }
}