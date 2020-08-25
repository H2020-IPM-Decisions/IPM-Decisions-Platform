import { UserProfileService } from '@app/shared/services/upr/user-profile.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-management-system',
  templateUrl: './content-management-system.component.html',
  styleUrls: ['./content-management-system.component.css']
})
export class ContentManagementSystemComponent implements OnInit {
data: any;
  constructor(private userProfileService: UserProfileService) { }

  ngOnInit() {

    this.data = this.userProfileService.getUserProfileMock();
  
  }



}
