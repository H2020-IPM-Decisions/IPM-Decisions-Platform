import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { compare } from "fast-json-patch";
import { HttpErrorResponse } from "@angular/common/http";

import { UserProfile } from "./../../../../shared/models/user-profile.model";
import { UserProfileForCreation } from "./../../../../shared/models/user-profile-for-creation.model";
import { UserProfileService } from "@app/shared/services/upr/user-profile.service";
import { AuthenticationService } from "@app/core/auth/services/authentication.service";
import { UserProfileForUpdate } from "@app/shared/models/user-profile-for-update.model";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
  selector: "app-edit-account",
  templateUrl: "./edit-account.component.html",
  styleUrls: ["./edit-account.component.css"],
})
export class EditAccountComponent implements OnInit {
  accountForm: FormGroup;
  countries = [
    {label:"Countries.Austria",value:"Austria"}, 
    {label:"Countries.Belgium",value:"Belgium"},
    {label:"Countries.Bulgaria",value:"Bulgaria"},
    {label:"Countries.Croatia",value:"Croatia"},
    {label:"Countries.Republic_of_Cyprus",value:"Republic of Cyprus"}, 
    {label:"Countries.Czech_Republic",value:"Czech Republic"},
    {label:"Countries.Denmark",value:"Denmark"},
    {label:"Countries.Estonia",value:"Estonia"}, 
    {label:"Countries.Finland",value:"Finland"},
    {label:"Countries.France",value:"France"},
    {label:"Countries.Great_Britain",value:"Great Britain"}, 
    {label:"Countries.Germany",value:"Germany"}, 
    {label:"Countries.Greece",value:"Greece"},
    {label:"Countries.Hungary",value:"Hungary"},
    {label:"Countries.Ireland",value:"Ireland"}, 
    {label:"Countries.Italy",value:"Italy"},
    {label:"Countries.Latvia",value:"Latvia"},
    {label:"Countries.Lithuania",value:"Lithuania"}, 
    {label:"Countries.Luxembourg",value:"Luxembourg"}, 
    {label:"Countries.Malta",value:"Malta"},
    {label:"Countries.Netherlands",value:"Netherlands"},
    {label:"Countries.Norway",value:"Norway"}, 
    {label:"Countries.Poland",value:"Poland"}, 
    {label:"Countries.Portugal",value:"Portugal"},
    {label:"Countries.Romania",value:"Romania"}, 
    {label:"Countries.Slovakia",value:"Slovakia"},
    {label:"Countries.Slovenia",value:"Slovenia"}, 
    {label:"Countries.Spain",value:"Spain"},
    {label:"Countries.Sweden",value:"Sweden"}];
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
    private _logger: NGXLogger,
    private _toastrTranslated: ToastrTranslationService
  ) {}

  ngOnInit() {
    // initialize form
    this.userAccountForm();
    //this.initToastMessageTranslated();
    // retreive current user
    this._userProfileService.getUserProfile(false).subscribe(
      (user: UserProfileForUpdate) => {
        this.updateUserProfile(user);
      },
      (err: any) => {
        this._logger.error("Error:",err);
        this._toastrTranslated.showTranslatedToastr("Error_messages.User_account_fetching_error","Common_labels.Error","toast-error");
      }
    );
  }

  // uploadProfileImage(x) {}

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
          this._toastrTranslated.showTranslatedToastr("Information_messages.User_account_updated","Common_labels.Success","toast-success");
          window.history.back();
        },
        (error: HttpErrorResponse) => {
          this._logger.error("Error:",error);
          this._toastrTranslated.showTranslatedToastr("Error_messages.User_account_updating_error","Common_labels.Error","toast-error");
        }
      );
    }
  }

  // uploadProfileImage(files: FileList) {
  //   const file = files.item(0);

  //   let reader = new FileReader();
  //   reader.addEventListener("load", (ev: any) => {

  //     let a = ev.target.result;
  //     this.imageUrl = ev.target.result;
  //   });
  //   reader.readAsDataURL(file);
  // }
}
