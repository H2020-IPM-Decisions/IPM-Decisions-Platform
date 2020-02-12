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

  constructor(
    private cmsService: CMSService
  ) { }

  ngOnInit() {
    init();
    this.cmsService
      .getBanner()
      .then((response: any) => { this.bannerUrl = response.image.path });
  }

}
