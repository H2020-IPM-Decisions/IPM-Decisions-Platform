import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CMSService {

  key = environment.key;
  cmsUrl = environment.cmsUrl;

  constructor(
    private http: HttpClient
  ) { }

  getUrl() {
    return this.cmsUrl;
  }

  getAssetPath() {
    return `${this.cmsUrl}/storage/uploads`;
  }

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

  getDSSUse() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/dssuse`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }
  
  getDSSEvaluation() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/dssevaluation`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getDSSAdaptation() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/dssadaptation`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getDSSIntegration() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/dssintegration`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeSlideshow() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homeslideshow`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeArticle1() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homearticle1`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeArticle2() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homearticle2`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeGrid() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homegrid`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getNews() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/news`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getTermsAndConditions() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/termsnconditions`, {
        headers: {
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

}
