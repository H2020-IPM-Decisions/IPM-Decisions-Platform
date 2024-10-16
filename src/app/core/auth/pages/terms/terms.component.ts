import { RegistrationEmail } from './../../../../shared/models/registration-email.model';
import { EmailService } from './../../../../shared/services/eml/email.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CMSService } from 'src/app/shared/services/cms.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserForRegistration } from '../../models/user-for-registration.model';
import { User } from '@app/core/auth/models/user.model';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  termsForm: FormGroup;
  submitted = false;
  termsAndConditions:any;
  isLoading: boolean = false;
  @Input() registrationData: UserForRegistration;
  @Output() termsAccepted = new EventEmitter<boolean>();
  @Output() message = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private cmsService: CMSService,
    private _authService: AuthenticationService,
    private _sanitizer: DomSanitizer
  ) {
    /*cmsService.getTermsAndConditions()
      .then((terms: any) => { this.termsAndConditions = terms.content });*/

    cmsService.getTermsConditions()
      .then((content: any) => {
        let languageFound: boolean = false;
        for (let key in content) {
          if(key === sessionStorage.getItem("selectedLanguage"))
          {
            this.termsAndConditions = this._sanitizer.bypassSecurityTrustHtml(content[key]);
            languageFound = true;
            if (content[key]==="") {
              this.termsAndConditions = this._sanitizer.bypassSecurityTrustHtml(content["en"]);
            }
          }
        }
        if(!languageFound) {
          this.termsAndConditions = this._sanitizer.bypassSecurityTrustHtml(content["en"]);
        }
      })
  }

  ngOnInit() {
    document.getElementById('login-box').classList.add("with-terms");
    document.getElementById('login-register-nav').hidden = true;
    this.termsForm = this.formBuilder.group(
      {
        acceptTerms: [false, Validators.requiredTrue]
      }
    );
  }
  get f() {
    return this.termsForm.controls;
  }
  onRegister(): void {
    this.submitted = true;
    if (this.termsForm.invalid) {
      return;
    }

    this.isLoading = true;

    this._authService.register(this.registrationData).subscribe(
      (registeredUser: User) => {
        if (registeredUser.id) {
          this.isLoading = false;
          this.message.emit(true);
          this.termsAccepted.emit(false);
        }
        document.getElementById('login-box').classList.remove("with-terms");
        document.getElementById('login-register-nav').hidden = false;
      },
      errorRes => {
        this.isLoading = false;
        this.termsAccepted.emit(false);
        this.message.emit(false);
        document.getElementById('login-box').classList.remove("with-terms");
        document.getElementById('login-register-nav').hidden = false;
      }
    );

  }


}
