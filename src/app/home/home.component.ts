import { MaprisksService } from './../shared/services/maprisks.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CMSService } from '../shared/services/cms.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import * as L from 'leaflet';
import * as esri_geo from "esri-leaflet-geocoder";
declare var init: any;
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
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

  isLoggedIn: boolean;
  state$: Observable<object>;
  collapseDiv: boolean;
  @Output() verified: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private cmsService: CMSService,
    private _authService: AuthenticationService,
    private router: Router,
    public _activatedRoute: ActivatedRoute,
    private maprisksService: MaprisksService
  ) {
    this.cmsUrl = cmsService.getUrl();
    this.cmsPath = cmsService.getUrl();
    this.assetPath = cmsService.getAssetPath();
  }

  ngOnInit() {
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
    this.maprisksService.initialize("map").subscribe((data) => {
      this.map = data;
      this.map.scrollWheelZoom.disable();
      this.map.zoomControl.setPosition('topright');
      console.log(this.map);
      const featureGroup = this.maprisksService.createFeatureGroup(this.map);
      let wheatIcon = L.icon({
        iconUrl: 'img/wheat-pointer.png',
        iconSize: [40, 50],
        iconAnchor: [20, 48],
        popupAnchor:  [0, -43]
      });
      L.marker([47.4744951, 10.9576836], {icon: wheatIcon})
        .bindPopup('Farm data goes here')
        .addTo(this.map);
    });

    // map search box
    var searchControl = esri_geo.geosearch().addTo(this.map);
    var results = L.layerGroup().addTo(this.map);

    searchControl.on("results", function (data) {
      results.clearLayers();
      for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
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
      cmsService.getNews().then((response: any) => {
        this.news = response;
      }),
    ];
    Promise.all(promises).then(() => {
      setTimeout(() => init(), 0);
    });

    this.isLoggedIn = this._authService.isLoggedIn();
  }

  goToRegistrationPage() {
    this.router.navigate(["/login"]).then(() => {
      document.getElementById("register-button").click();
    });
  }
}
