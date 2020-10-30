import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { compare } from "fast-json-patch";
import { HttpErrorResponse } from "@angular/common/http";
import { IndividualConfig, ToastrService } from "ngx-toastr";

import { UserProfile } from "./../../../../shared/models/user-profile.model";
import { UserProfileForCreation } from "./../../../../shared/models/user-profile-for-creation.model";
import { UserProfileService } from "@app/shared/services/upr/user-profile.service";
import { AuthenticationService } from "@app/core/auth/services/authentication.service";
import { UserProfileForUpdate } from "@app/shared/models/user-profile-for-update.model";
import { throwError } from "rxjs";

@Component({
  selector: "app-edit-account",
  templateUrl: "./edit-account.component.html",
  styleUrls: ["./edit-account.component.css"],
})
export class EditAccountComponent implements OnInit {
  accountForm: FormGroup;
  countries = ["GB", "Norway", "France", "Serbia"];
  private id: string;
  submitted;
  errors: string[] = [];
  isCreated: boolean = false;
  isUpdated: boolean = false;
  userProfile: UserProfileForCreation;
  imageUrl: string;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthenticationService,
    private _userProfileService: UserProfileService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    // initialize form
    this.userAccountForm();

    // retreive current user
    this._userProfileService.getUserProfile(false).subscribe(
      (user: UserProfileForUpdate) => {
        // console.log('user Pro', user);
        this.updateUserProfile(user);
      },
      (err: any) => {
        console.log("greska", err);
        this._toastr.show(
          "Error fetching user account!",
          "Error!",
          null,
          "toast-error"
        );
      }
    );
  } // end ngOnInit

  uploadProfileImage(x) {}

  private userAccountForm() {
    this.accountForm = this._fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: [
        this._authService.currentUserValue.email,
        [
          Validators.required,
          Validators.pattern(
            "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$"
          ),
        ],
      ],
      phoneNumber: ["", Validators.required],
      mobileNumber: ["", Validators.required],
      street: ["", Validators.required],
      city: ["", Validators.required],
      postcode: ["", Validators.required],
      country: ["", Validators.required],
    });
  }

  get f() {
    return this.accountForm.controls;
  }

  private updateUserProfile(user: UserProfileForUpdate) {
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      mobileNumber: user.mobileNumber,
      street: user.street,
      city: user.city,
      postcode: user.postcode,
      country: user.country,
    };
    // UPDATE USER PROFILE FORM
    this.accountForm.patchValue(userData);
    // UPDATE USER PROFILE FOR CREATION OBJECT ON INIT
    this.userProfile = userData;
  }

  onSubmit() {
    if (this.accountForm.invalid) return;

    const form: any = this.accountForm.value;

    const userProfileData: UserProfileForUpdate = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      mobileNumber: form.mobileNumber,
      street: form.street,
      city: form.city,
      postcode: form.postcode,
      country: form.country,
    };

    this.doUpdateUserProfile(userProfileData);
  }

  private doUpdateUserProfile(newData: UserProfileForUpdate) {
    if (this.userProfile && newData) {
      const patch = compare(this.userProfile, newData);

      this._userProfileService.updateUserProfile(patch).subscribe(
        (result) => {
          // this.isUpdated = true;
          this._toastr.show(
            "User account successfully updated!",
            "Success!",
            null,
            "toast-success"
          );
        },
        (error: HttpErrorResponse) => {
          this._toastr.show(
            "Error updating user account!",
            "Error!",
            null,
            "toast-error"
          );
        }
      );
    }
  }

  uploadProfileImage(files: FileList) {
    const file = files.item(0);
    console.log("file loaders", file);

    let reader = new FileReader();
    reader.addEventListener("load", (ev: any) => {
      console.log("event", ev);

      let a = ev.target.result;
      this.imageUrl = ev.target.result;
      console.log('dddd', a);
    });
    reader.readAsDataURL(file);
  }
}
