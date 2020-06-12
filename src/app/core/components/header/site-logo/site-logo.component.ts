import { Component, OnInit } from '@angular/core';
import { CMSService } from '@app/shared/services/cms.service';

@Component({
  selector: 'app-site-logo',
  templateUrl: './site-logo.component.html',
  styleUrls: ['./site-logo.component.css']
})
export class SiteLogoComponent implements OnInit {
  bannerUrl: any;

  constructor(
    private cmsService: CMSService
    ) { }

  ngOnInit() {
    let cmsService = this.cmsService;
    cmsService.getBanner()
        .then((response: any) => { this.bannerUrl = response.image.path })
  }

}
