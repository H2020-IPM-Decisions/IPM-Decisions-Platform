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
    let resultURL = "";
    try {
      if(value[0]=='/'){
        resultURL = this.cmsUrl + value;
      }else{
        resultURL = this.cmsUrl + "/" + value;
      }
      return resultURL;
    } catch (e) {
      return resultURL;
    }
  }

}
