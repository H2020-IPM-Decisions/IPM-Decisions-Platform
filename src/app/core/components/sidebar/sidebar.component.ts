import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

}
