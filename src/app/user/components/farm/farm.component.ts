import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.css']
})
export class FarmComponent implements OnInit {

  canRequestFarm = false;

  constructor(
     private authService: AuthenticationService
  ) { }

  ngOnInit() {
    // this.canRequestFarm = this.authService.currentUserValue.useraccesstype.includes("advisor");
  }

}
