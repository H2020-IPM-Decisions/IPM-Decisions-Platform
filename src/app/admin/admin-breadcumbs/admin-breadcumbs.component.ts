import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CMSService } from '@app/shared/services/cms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
declare var init: any;


@Component({
  selector: 'admin-breadcumbs',
  templateUrl: './admin-breadcumbs.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./admin-breadcumbs.component.css']
})
export class AdminBreadcumbsComponent implements OnInit {


  bannerUrl = "";
  cmsUrl: string;

  constructor(
    private cmsService: CMSService,
    private authenticationService: AuthenticationService
  ) {
    this.cmsUrl = cmsService.getUrl();
  }

  ngOnInit() {
    this.cmsService
      .getBanner()
      .then((response: any) => { this.bannerUrl = response.image.path });
  }

  logout() {
    this.authenticationService.logout();
  }

}
