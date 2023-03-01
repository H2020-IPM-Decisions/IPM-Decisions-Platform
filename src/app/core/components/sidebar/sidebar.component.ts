import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  username;
  $accountSub: Subscription;

  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.$accountSub = this.authenticationService.account$.subscribe(
      (account) => {
        if(account !== null){this.username = (/(.*)@/).exec(account.email)[1];}
      }
    )
  }

  logout() {
    this.authenticationService.logout();
  }

  public toggleSidebarOff(): void {
    if (window.innerWidth <= 980 ) {
      let sideBar: HTMLElement = document.getElementById("mySidebarId");
      let sidebarFooter: HTMLElement = document.getElementById("mySidebarFooter");
      let mainDoc: HTMLElement = document.getElementById("mainDocument")
      sideBar.style.width = "0px";
      sidebarFooter.style.display = "none";
      mainDoc.style.marginLeft = "0px"
      sessionStorage.setItem("sidebarminimized",JSON.stringify(true))
    }
  }
}
