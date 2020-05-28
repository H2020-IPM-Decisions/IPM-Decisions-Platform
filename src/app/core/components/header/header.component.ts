import { Component, OnInit, Input } from '@angular/core';
import { CMSService } from '@app/shared/services/cms.service';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  isLoggedIn: boolean;
  isAdmin: boolean;
  bannerUrl = "";
  cmsUrl: string;

  constructor(
    private cmsService: CMSService,
    private authService: AuthenticationService
  ) {
    this.cmsUrl = cmsService.getUrl();
  }

  ngOnInit() {
    this.cmsService
      .getBanner()
      .then((response: any) => { this.bannerUrl = response.image.path });

    this.isLoggedIn = this.authService.isLoggedIn();

      this.isAdmin = this.authService.isAdmin();
  }
  
  updateUrl(newUrl) {
    this.cmsService.setUrl(newUrl);
    this.cmsUrl = newUrl;
  }

  logout() {
    this.authService.logout();
  }

}
