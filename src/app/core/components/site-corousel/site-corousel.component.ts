import { Component, OnInit } from '@angular/core';
import { CMSService } from '@app/shared/services/cms.service';

@Component({
  selector: 'app-site-corousel',
  templateUrl: './site-corousel.component.html',
  styleUrls: ['./site-corousel.component.css']
})
export class SiteCorouselComponent implements OnInit {
  homeSlideshow: any = {};
  constructor(private _cmsService: CMSService) { }

  ngOnInit() {
    this._cmsService.getHomeSlideshow().then(response => this.homeSlideshow = response);
  }

}
