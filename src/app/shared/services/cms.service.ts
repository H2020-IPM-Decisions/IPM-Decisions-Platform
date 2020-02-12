import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CMSService {

  key = "3fd7616d24a0681333b1532d66bf0f";
  cmsUrl = "http://localhost:8080";

  constructor(
    private http: HttpClient
  ) { }

  getFooter() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/footer`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getBanner() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/banner`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

}
