import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CMSService } from '../shared/services/cms.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
declare var init: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  active: string = "login";

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

  isLoggedIn: boolean;
  state$: Observable<object>;
  collapseDiv: boolean;
  @Output() verified: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private cmsService: CMSService,
    private _authService: AuthenticationService,
    private router: Router,
    public _activatedRoute: ActivatedRoute
  ) {
    this.cmsUrl = cmsService.getUrl();
    this.cmsPath = cmsService.getUrl();
    this.assetPath = cmsService.getAssetPath();
  }

  ngOnInit() {


    this._activatedRoute.queryParams.subscribe(params => {
      if (params['token'] && params['userId']) {
        this.collapseDiv = true;
        this.verified.emit(true);
      } else {
        this.collapseDiv = false;
        this.verified.emit(false);
      }

    });

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
      setTimeout(() => init(), 0)
    })

    this.isLoggedIn = this._authService.isLoggedIn();
  }


}