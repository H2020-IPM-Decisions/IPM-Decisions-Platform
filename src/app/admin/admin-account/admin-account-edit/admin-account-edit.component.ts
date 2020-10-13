import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/auth/services/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserProfile } from '@app/shared/models/user-profile.model';
import { UserProfileForCreation } from '@app/shared/models/user-profile-for-creation.model';
import { UserProfileService } from '@app/shared/services/upr/user-profile.service';
import { compare } from 'fast-json-patch';


@Component({
  selector: 'app-admin-account-edit',
  templateUrl: './admin-account-edit.component.html',
  styleUrls: ['./admin-account-edit.component.css']
})
export class AdminAccountEditComponent implements OnInit {
  adminAccountForm: FormGroup;
  countries = ['GB', 'Norway', 'France', 'Serbia'];
  private id: string;
  submitted;
  errors: string[] = [];
  isCreated: boolean = false;
  isUpdated: boolean = false;
  userProfile: UserProfile;
  userProfileCreation: UserProfileForCreation;
  

  constructor(private formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService) { }

  ngOnInit() {
    this.id = this.authenticationService.currentUserValue.id;

    this.adminAccountForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [this.authenticationService.currentUserValue.email, 
          [Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")]
        ],
        phoneNumber: ['', Validators.required],
        // password: ['', [
        //   Validators.required, 
        //   Validators.minLength(6),
        //   Validators.pattern("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d][A-Za-z\\d!@#$%^&*()_+]{6,}$")]
        // ],
        // confirmPassword: ['', Validators.required],
      },
      // {  
      //   validator: MustMatch('password', 'confirmPassword')
      // }
    );


    this.userProfileService.getUserProfile().subscribe(
      (user: any) => {
        this.updateUserProfile(user);
        this.userProfile = user;
      },
      (err: any) => console.log(err)
    );
  }

  get f() {
    return this.adminAccountForm.controls;
  }

  updateUserProfile(user: UserProfile) {
    const fullName = user.fullName;
    const firstName = fullName.split(' ').slice(0, -1).join(' '); 
    const lastName = fullName.split(' ').slice(-1).join(' ');

    const userData = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: user.phoneNumber
    };
    // UPDATE USER PROFILE FORM
    this.adminAccountForm.patchValue(userData);
    // UPDATE USER PROFILE FOR CREATION OBJECT ON INIT
    this.userProfileCreation = userData;
  }

  onSubmit() {

    if(this.adminAccountForm.invalid) {
      return;
    }

    const form: any = this.adminAccountForm.value;

    const userProfileData: UserProfileForCreation = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber
    };

    // const userIdentityForm: any = {}

   
    if(this.userProfile && this.userProfile.id) {
      const patch = compare(this.userProfileCreation, userProfileData);
      this.userProfileService.updateUserProfile(patch).subscribe(
        (result) => {
          this.isUpdated = true;
        },
        (error) => {
          this.errors = error;
        }
      );
    } else {
      // this.userProfileService.createUserProfile(this.id, userProfileData).subscribe(
      //   (user: UserProfile) => {
      //   this.userProfile = {
      //     id: user.id,
      //     userId: user.userId,
      //     fullName: user.fullName,
      //     phoneNumber: user.phoneNumber,
      //     mobileNumber: user.mobileNumber,
      //     fullAddress: user.fullAddress,
      //   }; 

      //   this.userProfileCreation = userProfileData;
      //   this.isCreated = true;
      // },
      // error => {
      //   this.errors = error;}
      // )
    }
    
    
  }

  logout() {
    this.authenticationService.logout();
  }

}
