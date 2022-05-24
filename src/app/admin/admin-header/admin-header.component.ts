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
  public mini: boolean = true;
  
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

  
  public toggleSidebar(): void {
    let sideBar: HTMLElement = document.getElementById("mySidebarId");
    let sidebarFooter: HTMLElement = document.getElementById("mySidebarFooter");
    let mainDoc: HTMLElement = document.getElementById("mainDocument")
    if (this.mini) {
      sideBar.style.width = "280px";
      sidebarFooter.style.display = "block";
      mainDoc.style.marginLeft = "280px"
      this.mini = false;
    } else {
      sideBar.style.width = "0px";
      sidebarFooter.style.display = "none";
      mainDoc.style.marginLeft = "0px"
      this.mini = true;
    }
  }

}
