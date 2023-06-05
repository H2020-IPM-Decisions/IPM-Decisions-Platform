import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '@app/shared/services/translation.service';
import { FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';
import { MustMatch } from '@app/core/auth/_helpers/must-match.validator';
import { EmailService } from '@app/shared/services/eml/email.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IResetPassword } from '@app/core/auth/models/reset-password.model';
import { NGXLogger } from "ngx-logger";
import { Subscription } from 'rxjs';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
  })
  export class ResetPasswordComponent implements OnInit {
    public resetPasswordForm: FormGroup;
    public submitted: boolean = false;
    public modalRef: BsModalRef;
    public token: string;
    public email: string;
    public errorDescription: string;

    @ViewChild('resetPasswordModal') public resetPasswordModal: TemplateRef<any>;

    public $subscriptionSubmit: Subscription;

    constructor(
        private _route: ActivatedRoute,
        private _translationService: TranslationService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _emailService: EmailService,
        private _modalService: BsModalService,
        private _logger: NGXLogger,
      ) {
        this._translationService.initLanguageFromBrowser();
      }
    
      public ngOnInit() {
        this.initForm();
        var sub = this._route.queryParams.subscribe(
          (params) => {
            var { token, email } = params;
            this.token = encodeURIComponent(token);
            this.email = email;
            this._logger.debug("URL Parameters:",params);
            if(!token || !email){
              // Go back to Home page if no params are available
              this._logger.info("Parameters not found!");
              this._router.navigate(["/"]);
            }
          },
          null,
          () => { sub.unsubscribe() }
        )
      }

      public initForm() {
        this.resetPasswordForm = this._formBuilder.group(
          {
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
        return this.resetPasswordForm.controls;
      }

      onSubmit() {
        this.submitted = true;
        if (this.resetPasswordForm.invalid) {
          return;
        }
        const resetPasswordBody: IResetPassword = {
          email: this.email,
          password: (<string>this.f.newPassword.value),
          token: this.token
        };

       this.$subscriptionSubmit = this._emailService.resetPassword(resetPasswordBody).subscribe(
         (response) => {
            this.modalRef = this._modalService.show(this.resetPasswordModal);
          },
          (error) => {
            this._logger.error(error);
            this.errorDescription = error.error.errors[0].description;
            this.modalRef = this._modalService.show(this.resetPasswordModal);
          }
        );
      }
  }