import { Component, OnInit, Input,ViewEncapsulation } from '@angular/core';
import { CMSService } from 'src/app/shared/services/cms.service';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';


@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

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

  logout() {
    this.authenticationService.logout();
  }

}
