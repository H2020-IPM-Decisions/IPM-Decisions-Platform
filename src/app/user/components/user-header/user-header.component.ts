import { Component, OnInit, Input } from '@angular/core';

import { CMSService } from 'src/app/shared/services/cms.service';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SidebarMenuUpdateService } from '@app/shared/services/sidebar-menu-update/sidebar-menu-update.service';

@Component({
  selector: 'user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  bannerUrl = "";
  cmsUrl: string;
  isAdmin: boolean = false;
  isFarmer: boolean = false;
  isAdvisor: boolean = false;
  isDeveloper: boolean = false;

  constructor(
    private cmsService: CMSService,
    private _authService: AuthenticationService,
    private _sidebarMenuService: SidebarMenuUpdateService,
    private _route: ActivatedRoute
  ) {
    this.cmsUrl = cmsService.getUrl();
  }

  ngOnInit() {
    this.cmsService
      .getBanner()
      .then((response: any) => { this.bannerUrl = response.image.path });
         
    if (this._authService.currentUserValue.roles && this._authService.currentUserValue.roles.length > 0) {
      this.isAdmin = this._authService.isAdmin();
    } else {

      this._route.data.subscribe(data => {
        let currentClaim = this._authService.currentUserValue.useraccesstype;

        if (currentClaim && data.claims) {

          let activeClaim = data.claims.filter((item: string) => {
            return currentClaim.indexOf(item) != -1;
          });

          if (activeClaim.length > 0) {
            this.getActiveClaim(activeClaim);
          }
        }
      });
    }
  }

  getActiveClaim(activeClaim: string[]) {
    activeClaim.forEach((item: string) => {
      switch (item) {
        case "Farmer":
          this.isFarmer = true;
          break;
        case "Advisor":
          this.isAdvisor = true;
          break;
        case "Developer":
          this.isDeveloper = true;
          break;
      }
    })

  }

  showFarmActions(menuItem: string) {
    this._sidebarMenuService.changeSidebarMenu(menuItem);
  }

  logout() {
    this._authService.logout();
  }

}
