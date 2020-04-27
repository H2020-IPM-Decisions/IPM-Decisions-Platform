import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CMSService } from '../shared/services/cms.service';
import { User } from '../core/auth/models/user.model';
import { AuthenticationService } from '../shared/services/authentication.service';
import { Role } from '../core/auth/models/role.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
declare var init: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  cmsUrl;
  cmsPath = "";
  assetPath = "";
  bannerUrl = "";
  homeArticle1: any = {};
  homeArticle2: any = {};
  homeGrid: any = {};
  homeSlideshow: any = {};
  news: any = {};
  dssUse: any = {};
  dssEvaluation: any = {};
  dssAdaptation: any = {};
  dssIntegration: any = {};
  
  currentUser: User;
  state$: Observable<object>;
  constructor(
    private cmsService: CMSService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.cmsUrl = cmsService.getUrl();
    this.cmsPath = cmsService.getUrl();
    this.assetPath = cmsService.getAssetPath();
  }

  ngOnInit() {

    let cmsService = this.cmsService;
    let promises = [
      cmsService.getBanner()
        .then((response: any) => { this.bannerUrl = response.image.path }),
      cmsService.getDSSUse()
        .then((response: any) => { this.dssUse = response }),
      cmsService.getDSSEvaluation()
        .then((response: any) => { this.dssEvaluation = response; }),
      cmsService.getDSSAdaptation()
        .then((response: any) => { this.dssAdaptation = response }),
      cmsService.getDSSIntegration()
        .then((response: any) => { this.dssIntegration = response }),
      cmsService.getHomeArticle1()
        .then((response: any) => { this.homeArticle1 = response }),
      cmsService.getHomeArticle2()
        .then((response: any) => { this.homeArticle2 = response }),
      cmsService.getHomeGrid()
        .then((response: any) => { this.homeGrid = response }),
      cmsService.getHomeSlideshow()
        .then((response: any) => { this.homeSlideshow = response; }),
      cmsService.getNews()
        .then((response: any) => { this.news = response; }),
    ];
    Promise.all(promises).then(() => {
      setTimeout(()=>init(), 100)
    })
  }

  updateUrl(newUrl) {
    this.cmsService.setUrl(newUrl);
    this.cmsUrl = newUrl;
  }


}
