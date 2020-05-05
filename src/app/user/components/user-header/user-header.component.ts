import { Component, OnInit, Input } from '@angular/core';

import { CMSService } from 'src/app/shared/services/cms.service';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';

@Component({
  selector: 'user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  @Input() active;
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
  
  updateUrl(newUrl) {
    this.cmsService.setUrl(newUrl);
    this.cmsUrl = newUrl;
  }

  logout() {
    this.authenticationService.logout();
  }

}
