import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserForAuthentication } from '../../models/user-for-authentication.model';
import { Authentication } from './../../models/authentication.model';
import { AuthenticationService } from '../../services/authentication.service';
import { Role } from '../../enums/role.enum';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslationService } from '@app/shared/services/translation.service';
//import { IResendConfirmation } from '../../models/resend-confirmation-email.model';
//import { EmailService } from './../../../../shared/services/eml/email.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  forgotPass = false;
  loading = false;
  returnUrl: string;
  errorMessage = "";
  @ViewChild('loginModal', { static: false }) public loginModal: TemplateRef<any>;
  //@ViewChild('resendConfirmationEmailModal', { static: false }) public resendConfirmationEmailModal: TemplateRef<any>;
  modalRef: BsModalRef;
  emailNotConfirmed: boolean; //Email not confirmed

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private _translationService: TranslationService,
    //private _emailService: EmailService,
  ) { }

  ngOnInit() {
    this._translationService.initLanguage();
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")]],
        password: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d][A-Za-z\\d!@#$%^&*()_+]{6,}$")
        ]]
      },
    );
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  get f() {
    return this.loginForm.controls;
  }
  onLogin() {
    this.emailNotConfirmed = false;
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const userForAuthentication: UserForAuthentication = {
      email: (<string>this.f.email.value).toLowerCase(),
      password: this.f.password.value
    }

    this.loading = true;

    const loginObsever = {
      next:
        (res: Authentication) => {
          this.loading = false;
          const hasRoles = this.authenticationService.currentUserValue.roles;
          if (hasRoles && hasRoles.includes(Role.Admin)) {
            this.router.navigate(["/admin"]);
          } else {
            sessionStorage.setItem("hasDSS",JSON.stringify(res.hasDss))
            if (res.hasDss) {
              this.router.navigate(["/user/dss/dashboard"]);
            } else {
              this.router.navigate(["/user/farm"]);
            }
          }
        },
      error:
        (errorMessages: any) => {
          this.loading = false;
          this.errorMessage = errorMessages;
          if(this.errorMessage === "Email not confirmed"){
            this.emailNotConfirmed = true;
          }
          this.modalRef = this.modalService.show(this.loginModal);
        }
    }

    this.authenticationService
      .login(userForAuthentication)
      .subscribe(loginObsever);

  }

  forgotPassword() {
    this.forgotPass = true;
  }

  /*resendConfirmationEmail() {
    if (this.f.email.invalid) {
      return;
    }

    const emailForResendConfirmation: IResendConfirmation = {
      email: (<string>this.f.email.value).toLowerCase()
    }

    this._emailService.resendConfirmationEmail(emailForResendConfirmation).subscribe(response => {
      this.modalRef.hide();
      this.modalRef = this.modalService.show(this.resendConfirmationEmailModal);
    });
  }*/
}
