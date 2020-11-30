import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "@app/core/auth/services/authentication.service";
import { UserProfileService } from '@app/shared/services/upr/user-profile.service';
import { UserProfile } from '@app/shared/models/user-profile.model';

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"],
})
export class AccountComponent implements OnInit {
  user: UserProfile;
  userRole;
  constructor(
    private _userProfileService: UserProfileService,
    public authService: AuthenticationService
  ) {
    var userAccessType = this.authService.currentUserValue.useraccesstype;
    if (userAccessType.includes('farmer')) {
      this.userRole = 'farmer';
    } else if (userAccessType.includes('advisor')) {
      this.userRole = 'advisor';
    } else if (userAccessType.includes('developer')) {
      this.userRole = 'developer';
    }
  }

  ngOnInit() {
    this._userProfileService.getUserProfile(true)
      .subscribe((userFriendly: UserProfile) => {
        this.user = userFriendly;
        console.log(this.user);
      });
  }

}
