import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CMSService } from '@app/shared/services/cms.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { SidebarMenuUpdateService } from '@app/shared/services/sidebar-menu-update/sidebar-menu-update.service';
declare var init: any;


@Component({
  selector: 'user-header-sx',
  templateUrl: './user-sx.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./user-sx.component.css']
})
export class UserSxComponent implements OnInit {


  bannerUrl = "";
  cmsUrl: string;

  private activeMenuItem: string;

  constructor(
    private cmsService: CMSService,
    private authenticationService: AuthenticationService,
    private _sidebarMenuService: SidebarMenuUpdateService

  ) {
    this.cmsUrl = cmsService.getUrl();
  }

  ngOnInit() {
    this.cmsService
      .getBanner()
      .then((response: any) => { this.bannerUrl = response.image.path });

      this._sidebarMenuService.currentMenu.subscribe(item => this.activeMenuItem = item);
  }

  logout() {
    this.authenticationService.logout();
  }

}
