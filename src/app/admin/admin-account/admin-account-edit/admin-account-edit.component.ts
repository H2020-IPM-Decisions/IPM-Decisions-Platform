import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';

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
