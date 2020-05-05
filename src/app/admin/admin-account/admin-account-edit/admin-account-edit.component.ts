import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';

@Component({
  selector: 'app-admin-account-edit',
  templateUrl: './admin-account-edit.component.html',
  styleUrls: ['./admin-account-edit.component.css']
})
export class AdminAccountEditComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
  }

}
