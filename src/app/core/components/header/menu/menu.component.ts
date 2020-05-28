import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isAdmin: boolean;
  hasClaim: string;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    
    if(this.authService.currentUserValue.roles.length > 0) {
      this.isAdmin = this.authService.isAdmin();
    } else {
      let claim = this.authService.getClaim();
      this.hasClaim = claim;
      
    }

  }

}
