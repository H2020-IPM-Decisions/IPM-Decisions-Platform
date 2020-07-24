import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CMSService } from '../shared/services/cms.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import {MaprisksService} from './maprisks.service';
import * as L from 'leaflet';
declare var init: any;
@Component({
  selector: 'app-maprisks',
  templateUrl: './maprisks.component.html',
  styleUrls: ['./maprisks.component.css'] 
})

export class MapRisksComponent implements OnInit {

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

  map!: L.Map;

  constructor(
    private cmsService: CMSService,
    private _authService: AuthenticationService,
    private router: Router,
    private maprisksService: MaprisksService,
    public _activatedRoute: ActivatedRoute
  ) {
    this.cmsUrl = cmsService.getUrl();
    this.cmsPath = cmsService.getUrl();
    this.assetPath = cmsService.getAssetPath();
  }

  ngOnInit() {


    this._activatedRoute.queryParams.subscribe(params => {
      console.log("dfsfa", params);
      console.log(params['token']);

      if (params['token'] && params['userId']) {
        this.collapseDiv = true;
        this.verified.emit(true);
      } else {
        this.collapseDiv = false;
        this.verified.emit(false);
      }

    });

    this.maprisksService.initialize ('map').subscribe(data=> {
      this.map=data;
      const featureGroup = this.maprisksService.createFeatureGroup(this.map);
      this.maprisksService.addMarker(47.4744951, 10.9576836, featureGroup);
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
