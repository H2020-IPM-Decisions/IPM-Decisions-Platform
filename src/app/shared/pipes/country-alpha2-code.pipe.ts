import { Pipe, PipeTransform } from '@angular/core';
import * as isoConverter from 'iso-3166-1';
import { ICountryCode } from '../interfaces/country-code.interface';
/* 
    This pipe convert a given ALPHA 3 ISO 3166-1 Country code as ALPHA 2
    Example: "GBR | countryAlpha2" Return: "GB"
*/
@Pipe({name: 'countryAlpha2',pure: false})
export class CountryAlpha2CodePipe implements PipeTransform {
    constructor(){}
    transform(code: string): string {
        const countryObj: ICountryCode = isoConverter.whereAlpha3(code);
        return countryObj.alpha2.toLowerCase();
    }
}