import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { CookieService } from 'ngx-cookie';

@Injectable({
  providedIn: 'root'
})
export class CMSService {

  key = environment.key;
  cmsUrl = environment.cmsUrl;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.cmsUrl = this.cmsUrl;
  }

  getUrl() {
    return this.cmsUrl;
  }

  setUrl(newUrl) {
    this.cmsUrl = newUrl;
  }

  getAssetPath() {
    return `${this.cmsUrl}/storage/uploads?token=${this.key}`;
  }

  getFooter() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/footer?token=${this.key}`)
      .toPromise();
  }

  getBanner() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/banner?token=${this.key}`)
      .toPromise();
  }

  getDSSUse() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/dssuse?token=${this.key}`)
      .toPromise();
  }

  getDSSEvaluation() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/dssevaluation?token=${this.key}`)
      .toPromise();
  }

  getDSSAdaptation() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/dssadaptation?token=${this.key}`)
      .toPromise();
  }

  getDSSIntegration() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/dssintegration?token=${this.key}`)
      .toPromise();
  }

  getHomeSlideshow() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homeslideshow?token=${this.key}`)
      .toPromise();
  }

  getHomeArticle1() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homearticle1?token=${this.key}`)
      .toPromise();
  }

  getHomeArticle2() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homearticle2?token=${this.key}`)
      .toPromise();
  }

  getHomeGrid() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homegrid?token=${this.key}`)
      .toPromise();
  }

  getNews() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/news?token=${this.key}`)
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
