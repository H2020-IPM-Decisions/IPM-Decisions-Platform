import { Pipe, PipeTransform } from '@angular/core';
import * as isoConverter from 'iso-3166-1';
import { ICountryCode } from '../interfaces/country-code.interface';
/* 
    This pipe convert a given ALPHA 3 ISO 3166-1 Country code as COUNTRY NAME
    Example: "ITA | countryName" Return: "Italy"
*/
@Pipe({name: 'countryName',pure: false})
export class CountryNamePipe implements PipeTransform {
    constructor(){}
    transform(code: string): string {
        const countryObj: ICountryCode = isoConverter.whereAlpha3(code);
        return countryObj.country.toUpperCase();
    }
}