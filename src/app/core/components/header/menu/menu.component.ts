import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isAdmin: boolean = false;
  isFarmer: boolean = false;
  isAdvisor: boolean = false;
  isDeveloper: boolean = false;

  constructor(private _authService: AuthenticationService, private _route: ActivatedRoute) { }

  ngOnInit() {

    if (this._authService.currentUserValue.roles && this._authService.currentUserValue.roles.length > 0) {
      this.isAdmin = this._authService.isAdmin();
    } else {

      this._route.data.subscribe(data => {
        let currentClaim = this._authService.currentUserValue.claims;

        if (currentClaim && data.claims) {

          let activeClaim = data.claims.filter((item: string) => {
            return currentClaim.indexOf(item) != -1;
          });

          if (activeClaim.length > 0) {
            this.getActiveClaim(activeClaim);
          }
          console.log(this.isAdmin);
          console.log(this.isFarmer);
          console.log(this.isAdvisor);
          console.log(this.isDeveloper);

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

}
