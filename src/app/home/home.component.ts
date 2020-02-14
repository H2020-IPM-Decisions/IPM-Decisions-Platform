import { Component, OnInit } from '@angular/core';
import { CMSService } from '../shared/services/cms.service';
declare var init: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  bannerUrl = "";
  dssUseDescription: "";
  dssEvaluationDescription: "";
  dssAdaptationDescription: "";
  dssIntegrationDescription: "";

  constructor(
    private cmsService: CMSService
  ) { }

  ngOnInit() {
    let cmsService = this.cmsService;
    init();
    cmsService.getBanner()
      .then((response: any) => { this.bannerUrl = response.image.path });
    cmsService.getDSSUse()
      .then((response: any) => { this.dssUseDescription = response.description });
    cmsService.getDSSEvaluation()
      .then((response: any) => { this.dssEvaluationDescription = response.description });
    cmsService.getDSSAdaptation()
      .then((response: any) => { this.dssAdaptationDescription = response.description });
    cmsService.getDSSIntegration()
      .then((response: any) => { this.dssIntegrationDescription = response.description });
  }

}
