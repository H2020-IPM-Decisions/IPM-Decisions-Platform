import { MaprisksService } from './../shared/services/maprisks.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, OnDestroy, TemplateRef } from '@angular/core';
import { CMSService } from '../shared/services/cms.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, timer } from 'rxjs';
import * as L from 'leaflet';
import * as esri_geo from "esri-leaflet-geocoder";
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import ImageWMS from 'ol/source/ImageWMS.js';
import proj4 from 'proj4';
import Projection from 'ol/proj/Projection.js';
import { register } from 'ol/proj/proj4';
import { Image as ImageLayer, Tile as TileLayer } from 'ol/layer.js';
import { LayerConfigurarion, LegendItems, MapConfiguration, RiskMap, RiskMapProvider } from '@app/shared/models/riskmap.model';
import { UserProfileService } from '@app/shared/services/upr/user-profile.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {FullScreen, defaults as defaultControls} from 'ol/control.js';

declare var init: any;
declare var home: any;
declare var $;
@Component({
  selector: "app-home",
  templateUrl: "./newhome.component.html", // NEW TEMPLATE: rimuovere il prefisso new dai file html e css per avere il vecchio template
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./newhome.component.css", "./newstyle.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  active: string = "home";
  map: Map;
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

  riskMapDescription: any;

  // CARDS content variables
  emailUsContent: any;
  webSiteContent: any;
  usefulLinksContent: any;

  // FOOTER Content
  footerContent: any;
  footerMiddleContent: any;

  welcomeContent: any;

  @Output() verified: EventEmitter<boolean> = new EventEmitter<boolean>();

  public username: string;
  public $accountSub: Subscription;

  public sessionTimeLeftToShow: number;
  public $sessionExpirationTimer: Subscription;
  public $sessionExtend: Subscription;
  public sessionIsExpired: boolean = false;
  public showRelatedProjects: boolean = false;
  public relatedProjectsList:any;


  public AvailableRiskMapProviders: RiskMapProvider[];
  public SelectedRiskMapId: string;
  public SelectedRiskMapProvider: RiskMapProvider;
  public SelectedRiskMap: RiskMap;
  public SelectedRiskMapConfiguration: MapConfiguration;
  public SelectedRiskMapLayersConfiguration: LayerConfigurarion[] = [];
  public SelectedRiskMapLayersName: string[] = [];
  public RiskMapLayers: string[] = [];
  public modalRef: BsModalRef;

  public riskMapCurrentDate: string;
  public riskMapCurrentLayer: LayerConfigurarion;
  public selectedLayerLegendUrl: string = "";
  public selectedLayerLegend: LegendItems[];

  constructor(
    private cmsService: CMSService,
    private _authService: AuthenticationService,
    private router: Router,
    public _activatedRoute: ActivatedRoute,
    private maprisksService: MaprisksService,
    private _sanitizer: DomSanitizer,
    private _userProfileService: UserProfileService,
    private _modalService: BsModalService
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
/*      cmsService.getBanner().then((response: any) => {
        this.bannerUrl = response.image.path;
      }),*/
      cmsService.getNewBanner().then((response: any) => { //NEW TEMPLATE: per avere il vecchio banner usare il metodo commentato sopra
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
      cmsService.getNewPublicPageFooter()
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
      cmsService.getEUFlagBanner()
      .then((footerMiddle: any) => {
        let languageFound: boolean = false;
        for (let key in footerMiddle) {
          if(key === sessionStorage.getItem("selectedLanguage"))
          {
            this.footerMiddleContent = this._sanitizer.bypassSecurityTrustHtml(footerMiddle[key]);
            languageFound = true;
            if (footerMiddle[key]==="") {
              this.footerMiddleContent = this._sanitizer.bypassSecurityTrustHtml(footerMiddle["en"]);
            }
          }
        }
        if(!languageFound) {
          this.footerMiddleContent = this._sanitizer.bypassSecurityTrustHtml(footerMiddle["en"]);
        }
      }),
      cmsService.getHomePageWelcome()
      .then((welcome: any) => {
        let languageFound: boolean = false;
        for (let key in welcome) {
          if(key === sessionStorage.getItem("selectedLanguage"))
          {
            this.welcomeContent = this._sanitizer.bypassSecurityTrustHtml(welcome[key]);
            languageFound = true;
            if (welcome[key]==="") {
              this.welcomeContent = this._sanitizer.bypassSecurityTrustHtml(welcome["en"]);
            }
          }
        }
        if(!languageFound) {
          this.welcomeContent = this._sanitizer.bypassSecurityTrustHtml(welcome["en"]);
        }
      }),
      cmsService.getRiskMapDescription()
      .then((description: any) => {
        let languageFound: boolean = false;
        for (let key in description) {
          if(key === sessionStorage.getItem("selectedLanguage"))
          {
            this.riskMapDescription = this._sanitizer.bypassSecurityTrustHtml(description[key]);
            languageFound = true;
            if (description[key]==="") {
              this.riskMapDescription = this._sanitizer.bypassSecurityTrustHtml(description["en"]);
            }
          }
        }
        if(!languageFound) {
          this.riskMapDescription = this._sanitizer.bypassSecurityTrustHtml(description["en"]);
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

    this._userProfileService.getRiskMapProviders().subscribe(
      (response: HttpResponse<any>) => {
          console.log(response)
          this.AvailableRiskMapProviders = response.body;
          this.SelectedRiskMapId = `${this.AvailableRiskMapProviders[0].id}.${this.AvailableRiskMapProviders[0].providerId}`;
          this.SelectedRiskMapProvider = this.AvailableRiskMapProviders[0];
          this.getMapData();
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
  );


    window.onclick = (event) => {
      if(!event.target.matches('.related-projects-button')){
        if(this.showRelatedProjects){
          this.showRelatedProjects = false;
        }
      }
    }

    document.getElementsByClassName("related-projects-button")[0].addEventListener('click', event => event.stopPropagation());
  }

  private getMapData(){
    this._userProfileService.getRiskMap(this.SelectedRiskMapProvider.providerId, this.SelectedRiskMapProvider.id).subscribe(
      (response: HttpResponse<any>) => {

          this.SelectedRiskMap = response.body;
          this.SelectedRiskMapConfiguration = this.SelectedRiskMap.mapConfiguration;
          this.SelectedRiskMapLayersConfiguration = this.SelectedRiskMapConfiguration.layersConfiguration;
          this.SelectedRiskMapLayersName = [];
          this.RiskMapLayers = [];
          const parser: DOMParser = new DOMParser();
          const tmpDoc: Document = parser.parseFromString(this.SelectedRiskMapConfiguration.abstract, "text/html");
          const spanElement: NodeListOf<HTMLSpanElement> = tmpDoc.querySelectorAll("span[itemprop]");
          spanElement.forEach(spanItem => {this.RiskMapLayers.push(spanItem.textContent);});
          for (let layer of this.SelectedRiskMapLayersConfiguration) {
            let layerName = layer.name.split(".")[1];
            this.SelectedRiskMapLayersName.push(layerName);
          }

          this.configureMap();

      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  private configureMap(){
    this.riskMapCurrentLayer = this.SelectedRiskMapLayersConfiguration[0];
    this.riskMapCurrentDate = this.riskMapCurrentLayer.dates[this.riskMapCurrentLayer.dates.length - 1];
    this.selectedLayerLegendUrl = this.riskMapCurrentLayer.legendURL;
    this.selectedLayerLegend = this.riskMapCurrentLayer.legendMetadata.legendItems;
    this.initializeMap();
  }

  initializeMap() {
    const layers = [
      new TileLayer({
        source: new OSM(),
      }),
      new ImageLayer({
        source: new ImageWMS({
          url: this.SelectedRiskMap.wmsUrl,
          params: { LAYERS: `${this.riskMapCurrentLayer.name}.${this.riskMapCurrentDate}`, TRANSPARENT: 'TRUE' },
          ratio: 1,
          serverType: 'mapserver',
          projection: this.SelectedRiskMapConfiguration.projection,
        }),
        opacity: 0.5
      }),
    ];

    this.map = new Map({
      target: 'riskmap',
      layers: layers,
      controls: [new FullScreen()],
      view: new View({
        center: [1955109.15554, 9562668.726335],
        zoom: 3,
      }),
    });
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

  showRelatedProjectsList() {
    this.showRelatedProjects = true;
  }

  riskMapProviderChanged($event: any) {
    // console.log(this.SelectedRiskMapId);
    // console.log(this.SelectedRiskMapProvider);
    // console.log($event.target.value);
    var selectedRMP = this.AvailableRiskMapProviders.find((riskMapProvider) => riskMapProvider.id == $event.target.value.split('.')[0])
    this.SelectedRiskMapId = `${selectedRMP.id}.${selectedRMP.providerId}`;
    this.SelectedRiskMapProvider = selectedRMP;
    this.map.dispose();
    // console.log(this.SelectedRiskMapId)
    // console.log(this.SelectedRiskMapProvider)
    this.getMapData();
  }

  moveDateSlider(offset: number){

    let dataSlider = <HTMLInputElement>document.getElementById("dataslider");

    if((+dataSlider.value == 0 && offset < 0) || (+dataSlider.value == (this.riskMapCurrentLayer.dates.length -1) && offset > 0)){
      return;
    }

    dataSlider.value = String(+dataSlider.value + offset);
    this.riskMapCurrentDateChange(+dataSlider.value);

  }

  riskMapCurrentDateChange(value: any){
    this.riskMapCurrentDate = this.riskMapCurrentLayer.dates[value];
    this.modifyMap();
  }

  riskMapCurrentLayerChanged(value: any){

    let previousLayerButton = <HTMLInputElement>document.getElementById(this.riskMapCurrentLayer.name.split(".")[1]);
    previousLayerButton.checked = false;

    this.changeSelectedLayer(value);

  }

  changeSelectedLayer(value: any){

    let dataSlider = <HTMLInputElement>document.getElementById("dataslider");

    this.riskMapCurrentLayer = this.SelectedRiskMapLayersConfiguration.find((layer) => layer.name == (this.SelectedRiskMap.id+"."+value));
    this.riskMapCurrentDate = this.riskMapCurrentLayer.dates[+dataSlider.value];
    this.selectedLayerLegendUrl = this.riskMapCurrentLayer.legendURL;
    this.selectedLayerLegend = this.riskMapCurrentLayer.legendMetadata.legendItems;

    this.modifyMap()

  }

  modifyMap(){
    this.map.getAllLayers()[1].get("source").updateParams(
      {
        LAYERS: `${this.riskMapCurrentLayer.name}.${this.riskMapCurrentDate}`, TRANSPARENT: 'TRUE'
      }
    );
    this.map.getAllLayers()[1].get("source").refresh();
  }

  openModal(template: TemplateRef<any>, size?: string) {
    this.modalRef = this._modalService.show(template, {class: size});
  }
}
