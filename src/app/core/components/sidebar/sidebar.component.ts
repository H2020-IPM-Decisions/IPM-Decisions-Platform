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
}
