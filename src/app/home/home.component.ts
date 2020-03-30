import { Component, OnInit } from '@angular/core';
import { CMSService } from '../shared/services/cms.service';
declare var init: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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

  constructor(
    private cmsService: CMSService
  ) {
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

}
