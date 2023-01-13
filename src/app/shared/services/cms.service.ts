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

  getNews_OLD() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/news?token=${this.key}`)
      .toPromise();
  }

  getTermsAndConditions() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/termsnconditions`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getNews(language: string) {
    return this.http
      .get(`${this.cmsUrl}/api/collections/get/news_`+language, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeIntroduction() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/homeintroduction`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeTitle() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/hometitle`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getFarmersAdvisorsArticle() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/farmersadvisorsarticle`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getResearchersArticle() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/researchersarticle`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getDevelopersArticle() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/developersarticle`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getForgotPasswordConfirmationMessage() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/forgotpasswordconfirmation`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getRegistrationConfirmationMessage() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/registrationconfirmation`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getTermsConditions() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/termsandconditions`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeCardEmailUs() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/HomeCardEmailUs`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeCardWebSite() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/HomeCardWebSite`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomeCardUsefulLinks() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/HomeCardUsefulLinks`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getPublicPageFooter() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/PublicPageFooter`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getPublicPageFooterMiddle() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/PublicPageFooterMiddle`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }

  getHomePageWelcome() {
    return this.http
      .get(`${this.cmsUrl}/api/singletons/get/HomePageWelcome`, {
        headers: {
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          'Cockpit-Token': `${this.key}`
        }
      })
      .toPromise();
  }
}
