import { Pipe, PipeTransform } from '@angular/core';
import { CMSService } from '../services/cms.service';

@Pipe({
  name: 'cmsLink'
})
export class CmsLinkPipe implements PipeTransform {

  cmsUrl;

  constructor(
    private cmsService: CMSService,
  ) {
    this.cmsUrl = cmsService.getUrl();
  }

  transform(value: string, ...args: any[]): any {
    try {
      return value[0]=='/' ? this.cmsUrl + value: value;
    } catch (e) {
      return "";
    }
  }

}
