import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MustMatch } from '@app/core/auth/_helpers/must-match.validator';
import { compare } from 'fast-json-patch';

import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserProfileService } from '../../../../shared/services/user-profile.service';
import { UserProfile } from './../../../../shared/models/user-profile.model';
import { UserProfileForCreation } from './../../../../shared/models/user-profile-for-creation.model';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  accountForm: FormGroup;
  countries = ['GB', 'Norway', 'France', 'Serbia'];
  private id: string = this.authenticationService.currentUserValue.id;

  errors: string[] = [];
  isCreated: boolean = false;
  isUpdated: boolean = false;
  // userIdentity: User;
  userProfile: UserProfile;
  userProfileCreation: UserProfileForCreation;

  constructor(
    private formBuilder: FormBuilder, 
    private authenticationService: AuthenticationService,
    private userProfileService: UserProfileService) { }

  ngOnInit() {
    this.accountForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: [this.authenticationService.currentUserValue.email, 
          [Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")]
        ],
        phoneNumber: ['', Validators.required],
        mobileNumber: ['', Validators.required],
        address: ['', Validators.required],
      //   address2: ['', Validators.required],
      //   address3: ['', Validators.required],
        postcode: ['', Validators.required],
        country: ['', Validators.required],
        password: ['', [
          Validators.required, 
          Validators.minLength(6),
          Validators.pattern("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d][A-Za-z\\d!@#$%^&*()_+]{6,}$")]
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );


    // this.userProfileService.getUser(this.id).subscribe(
    //   (user: UserProfile) => {
    //     this.updateUserIdentity(user);
    //     this.userProfile = user;
    //   },
    //   (err: any) => console.log(err)
    // );

    this.userProfileService.getUserProfile(this.id).subscribe(
      (user: UserProfile) => {
        this.updateUserProfile(user);
        this.userProfile = user;
      },
      (err: any) => console.log(err)
    );

    

  } // end ngOnInit


  get f() {
    return this.accountForm.controls;
  }

  // updateUserIdentity(user: User) {
  //   this.accountForm.patchValue({
  //     email: user.email
  //   })
  // }
 
  updateUserProfile(user: UserProfile) {
    const fullName = user.fullName;
    const firstName = fullName.split(' ').slice(0, -1).join(' '); 
    const lastName = fullName.split(' ').slice(-1).join(' ');

    const userData = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: user.phoneNumber,
      mobileNumber: user.mobileNumber,
      address: user.address,
      postcode: user.postcode,
      country: user.country
    };
    // UPDATE USER PROFILE FORM
    this.accountForm.patchValue(userData);
    // UPDATE USER PROFILE FOR CREATION OBJECT ON INIT
    this.userProfileCreation = userData;
  }

  onSubmit() {

    if(this.accountForm.invalid) {
      // return false;
    }
    const form: any = this.accountForm.value;

    const userProfileData: UserProfileForCreation = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      mobileNumber: form.mobileNumber,
      address: form.address,
      postcode: form.postcode,
      country: form.country
    };

    // const userIdentityForm: nesto = {}

   
    if(this.userProfile && this.userProfile.id) {
      const patch = compare(this.userProfileCreation, userProfileData);
      this.userProfileService.updateUserProfile(this.userProfile.userId, patch).subscribe(
      result => {     
        this.isUpdated = true;
      },
      error => {
        console.log("error", error);
        this.errors = error;
      })
    } else {
      this.userProfileService.createUserProfile(this.id, userProfileData).subscribe(
        (user: UserProfile) => {
        // console.log("res", user);   
        this.userProfile =  {
          id: user.id,
          userId: user.userId,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          mobileNumber: user.mobileNumber,
          address: user.address,
          postcode: user.postcode,
          country: user.country
        }; 

        this.userProfileCreation = userProfileData;
        this.isCreated = true;
      },
      error => {
        console.log("error", error);
        this.errors = error;
      })
    }
    
    
  }



  

}
