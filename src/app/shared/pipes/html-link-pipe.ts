import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'htmlLink'})
export class HtmlLinkPipe implements PipeTransform{
    constructor() {}
    transform(value: any): any {
      return value.replace(/\bhttps?:\/\/\S+/gi, function (match) {
        return '<a href="' + match + '" target="_blank" rel="noopener noreferrer">' + match + '</a>';
      });
    }
}