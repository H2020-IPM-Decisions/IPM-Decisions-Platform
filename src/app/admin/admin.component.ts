import { Component, OnInit } from '@angular/core';
import { CMSService } from '@app/shared/services/cms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
declare var init: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  active: string = "home";

  cmsUrl;
  cmsPath = "";
  assetPath = "";
  bannerUrl = "";
  homeArticle1: any = {};
  homeArticle2: any = {};
  homeGrid: any = {};
  news: any = {};
  dssUse: any = {};
  dssEvaluation: any = {};
  dssAdaptation: any = {};
  dssIntegration: any = {};
  isLoggedIn: boolean;

  constructor(
    private cmsService: CMSService,
    private _authService: AuthenticationService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    this.cmsUrl = cmsService.getUrl();
    this.cmsPath = cmsService.getUrl();
    this.assetPath = cmsService.getAssetPath();
  }

  ngOnInit() {

    this.isLoggedIn = this._authService.isLoggedIn();

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
      cmsService.getNews()
        .then((response: any) => { this.news = response; }),
    ];
   
  }

}
