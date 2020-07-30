import { Component, OnInit, Input,ViewEncapsulation } from '@angular/core';
import { CMSService } from 'src/app/shared/services/cms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
declare var init: any;

@Component({
  selector: 'icons',
  templateUrl: './icons.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {

  @Input() active;
  bannerUrl = "";
  cmsUrl: string;

  constructor(
    private cmsService: CMSService,
    private authenticationService: AuthenticationService,
    private router: Router
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
