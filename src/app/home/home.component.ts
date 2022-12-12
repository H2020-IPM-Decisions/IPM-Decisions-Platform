import { MaprisksService } from './../shared/services/maprisks.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CMSService } from '../shared/services/cms.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, timer } from 'rxjs';
import * as L from 'leaflet';
import * as esri_geo from "esri-leaflet-geocoder";
declare var init: any;
declare var home: any;
declare var $;
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./home.component.css", "./style.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  active: string = "home";
  map;
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

  sliderImageSize = 300;
  isLoggedIn: boolean;
  state$: Observable<object>;
  collapseDiv: boolean;
  testNews = [];
  homeIntro: any;
  homeTitle: string;
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      }
    }
  }
  // !!! Temporary variable for development banner
  showDevBanner: boolean = true;

  // CARDS content variables
  emailUsContent: any;
  webSiteContent: any;
  usefulLinksContent: any;

  // FOOTER Content
  footerContent: any;

  @Output() verified: EventEmitter<boolean> = new EventEmitter<boolean>();

  public username: string;
  public $accountSub: Subscription;

  public sessionTimeLeftToShow: number;
  public $sessionExpirationTimer: Subscription;
  public $sessionExtend: Subscription;
  public sessionIsExpired: boolean = false;

  constructor(
    private cmsService: CMSService,
    private _authService: AuthenticationService,
    private router: Router,
    public _activatedRoute: ActivatedRoute,
    private maprisksService: MaprisksService,
    private _sanitizer: DomSanitizer
  ) {
    this.cmsUrl = cmsService.getUrl();
    this.cmsPath = cmsService.getUrl();
    this.assetPath = cmsService.getAssetPath();
  }

  ngOnInit() {
    home();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this._activatedRoute.queryParams.subscribe((params) => {
      if (params["token"] && params["userId"]) {
        this.collapseDiv = true;
        this.verified.emit(true);
      } else {
        this.collapseDiv = false;
        this.verified.emit(false);
      }
    });

    let cmsService = this.cmsService;
    let promises = [
      cmsService.getBanner().then((response: any) => {
        this.bannerUrl = response.image.path;
      }),
      cmsService.getDSSUse().then((response: any) => {
        this.dssUse = response;
      }),
      cmsService.getDSSEvaluation().then((response: any) => {
        this.dssEvaluation = response;
      }),
      cmsService.getDSSAdaptation().then((response: any) => {
        this.dssAdaptation = response;
      }),
      cmsService.getDSSIntegration().then((response: any) => {
        this.dssIntegration = response;
      }),
      cmsService.getHomeArticle1().then((response: any) => {
        this.homeArticle1 = response;
      }),
      cmsService.getHomeArticle2().then((response: any) => {
        this.homeArticle2 = response;
      }),
      cmsService.getHomeGrid().then((response: any) => {
        this.homeGrid = response;
      }),
      cmsService.getHomeSlideshow().then((response: any) => {
        this.homeSlideshow = response;
      }),
      cmsService.getHomeIntroduction()
      .then((hIntro: any) => {
        let languageFound: boolean = false;
        for (let key in hIntro) {
          if(key === sessionStorage.getItem("selectedLanguage"))
          {
            this.homeIntro = this._sanitizer.bypassSecurityTrustHtml(hIntro[key]);
            languageFound = true;
            if (hIntro[key]==="") {
              this.homeIntro = this._sanitizer.bypassSecurityTrustHtml(hIntro["en"]);
            }
          }
        }
        if(!languageFound) {
          this.homeIntro = this._sanitizer.bypassSecurityTrustHtml(hIntro["en"]);
        }
      }),
      /*cmsService.getNews().then((response: any) => {
        this.news = response;
      }),*/
      //cmsService.getTestNews(this.currentLanguage)
      cmsService.getNews(sessionStorage.getItem("selectedLanguage"))
      .then((tnews: any) => { 
        this.testNews = tnews.entries
      }),
      cmsService.getHomeTitle()
      .then((hTitle: any) => {
        let languageFound: boolean = false;
        for (let key in hTitle) {
          if(key === sessionStorage.getItem("selectedLanguage"))
          {
            this.homeTitle = hTitle[key];
            languageFound = true;
            if (hTitle[key]==="") {
              this.homeTitle = hTitle["en"];
            }
          }
        }
        if(!languageFound) {
          this.homeTitle = hTitle["en"];
        }
      }),
      cmsService.getHomeCardEmailUs().then((emailUs: any) => {
        this.emailUsContent = this._sanitizer.bypassSecurityTrustHtml(emailUs["HtmlContent"]);
      }),
      cmsService.getHomeCardWebSite().then((webSite: any) => {
        this.webSiteContent = this._sanitizer.bypassSecurityTrustHtml(webSite["HtmlContent"]);
      }),
      cmsService.getHomeCardUsefulLinks().then((usefulLinks: any) => {
        this.usefulLinksContent = this._sanitizer.bypassSecurityTrustHtml(usefulLinks["HtmlContent"]);
      }),
      cmsService.getPublicPageFooter()
      .then((footer: any) => {
        let languageFound: boolean = false;
        for (let key in footer) {
          if(key === sessionStorage.getItem("selectedLanguage"))
          {
            this.footerContent = this._sanitizer.bypassSecurityTrustHtml(footer[key]);
            languageFound = true;
            if (footer[key]==="") {
              this.footerContent = this._sanitizer.bypassSecurityTrustHtml(footer["en"]);
            }
          }
        }
        if(!languageFound) {
          this.footerContent = this._sanitizer.bypassSecurityTrustHtml(footer["en"]);
        }
      }),
    ];
    Promise.all(promises).then(() => {
      setTimeout(() => init(), 0);
    });

    // Check if user is logged in
    this.isLoggedIn = this._authService.isLoggedIn();
    // Format the user name
    if(this.isLoggedIn){
      this.$accountSub = this._authService.account$.subscribe(
        (account) => {
          if(account !== null){this.username = (/(.*)@/).exec(account.email)[1];}
        }
      )
      // Start Session timer
      this.oberserableTimer();
    }
  }

  goToRegistrationPage() {
    this.router.navigate(["/login"]).then(() => {
      document.getElementById("register-button").click();
    });
  }

  play() {
    $('.hero-slider').trigger("play.owl.autoplay");
    $('.hero-slider').trigger("next.owl.carousel");
  }

  pause() {
    $('.hero-slider').trigger("stop.owl.autoplay");
  }

  zoomIn() {
    this.sliderImageSize = Math.min(this.sliderImageSize + 100, 1000);
  }

  zoomOut() {
    this.sliderImageSize = Math.max(this.sliderImageSize - 100, 100);
  }

  ngOnDestroy(): void {
    if(this.$accountSub){
      this.$accountSub.unsubscribe();
    }
    if (this.$sessionExtend) {
      this.$sessionExtend.unsubscribe();
    }
    if (this.$sessionExpirationTimer) {
      this.$sessionExpirationTimer.unsubscribe();
    }
  }

  navigateToPrivatePages(): void {
    const userHasDss: boolean = JSON.parse(sessionStorage.getItem("hasDSS"));
    if (userHasDss) {
      this.router.navigate(["/user/dss/dashboard"]);
    } else {
      this.router.navigate(["/user/farm"]);
    }
  }

  private oberserableTimer(): void {
    if (this.$sessionExpirationTimer) {
      this.$sessionExpirationTimer.unsubscribe();
    }
    const source = timer(0, 1000);
    this.$sessionExpirationTimer = source.subscribe(() => {
      this.sessionTimeLeftToShow = this._authService.getExpirationAsSeconds();
      if (this.sessionTimeLeftToShow < 1) {
        this.$sessionExpirationTimer.unsubscribe();
        this.sessionIsExpired = true;
      }
    });
  }

  public isSessionExpiring(): boolean {
    if(this.sessionTimeLeftToShow < 60){
      return true;
    }
    return false;
  }

  public extendSession(): void {
    if (this.$sessionExtend) {
      this.$sessionExtend.unsubscribe();
    }
    this.$sessionExtend = this._authService.authenticateWithRefreshToken(sessionStorage.getItem("refresh_token")).subscribe(()=>{
      this.oberserableTimer();
      this.sessionIsExpired = false;
    });
  }

  public hideDevBanner(): void {
    this.showDevBanner = false;
  }
}
