import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AuthenticationService } from "@app/core/auth/services/authentication.service";
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { MustMatch } from "@app/core/auth/_helpers/must-match.validator";
import { EmailService } from '@app/shared/services/eml/email.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IChangePassword } from "@app/core/auth/models/change-password.model";
import { NGXLogger } from "ngx-logger";
import { Subscription } from 'rxjs';

@Component({
    selector: "app-edit-password",
    templateUrl: "./edit-password.component.html",
    styleUrls: ["./edit-password.component.css"],
})
export class EditPasswordComponent implements OnInit {

    public $subscriptionSubmit: Subscription;

    userRole = {description: "", value: ""};
    public changePasswordForm: FormGroup;
    public submitted: boolean = false;
    public user_id: string;
    public email: string;
    public modalRef: BsModalRef;
    public errorDescription: string;

    @ViewChild('changePasswordModal') public changePasswordModal: TemplateRef<any>;

    constructor(
    public authService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private _logger: NGXLogger,
    private _emailService: EmailService,
    private _modalService: BsModalService,
    ) {
    var userAccessType = this.authService.currentUserValue.useraccesstype;
    if (userAccessType.includes('farmer')) {
      this.userRole.description = 'Common_labels.Farmer';
      this.userRole.value = 'farmer';
    } else if (userAccessType.includes('advisor')) {
      this.userRole.description = 'Common_labels.Advisor';
      this.userRole.value = 'advisor';
    } else if (userAccessType.includes('developer')) {
      this.userRole.description = 'Common_labels.Developer';
      this.userRole.value = 'developer';
    }
  }

    ngOnInit(): void {
        this.initForm();
        this.user_id = this.authService.currentUserValue.id
    }

    public initForm() {
        this.changePasswordForm = this._formBuilder.group(
          {
            currentPassword: ['', [
                Validators.required,
                Validators.minLength(12),
                Validators.pattern("^(?=(?:[^a-z]*[a-z]))(?=.*[A-Z])(?=(?:[^0-9]*[0-9]))(?=.*[!-\/:-@\[-`{-~]).{12,}$")
              ]],
            newPassword: ['',
              [
                Validators.required,
                Validators.minLength(12),
                Validators.pattern("^(?=(?:[^a-z]*[a-z]))(?=.*[A-Z])(?=(?:[^0-9]*[0-9]))(?=.*[!-\/:-@\[-`{-~]).{12,}$")
              ]],
            confirmPassword: ['', Validators.required]
          },
          {
            validator: MustMatch('newPassword', 'confirmPassword')
          }
        );
      }

      get f() {
        return this.changePasswordForm.controls;
      }

      onSubmit() {
        this.submitted = true;
        if (this.changePasswordForm.invalid) {
          return;
        }
        const changePasswordBody: IChangePassword = {
          newPassword: (<string>this.f.newPassword.value),
          currentPassword: (<string>this.f.currentPassword.value)
        };

       this.$subscriptionSubmit = this._emailService.changePassword(changePasswordBody, this.user_id).subscribe(
         (response) => {
            this.modalRef = this._modalService.show(this.changePasswordModal);
          },
          (error) => {
            this._logger.error(error);
            this.errorDescription = error.error.errors[0].description;
            this.modalRef = this._modalService.show(this.changePasswordModal);
          }
        );
      }

}