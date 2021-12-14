import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match.validator';
import { AuthenticationService } from '../../services/authentication.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { CMSService } from '@app/shared/services/cms.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var init: any;
declare var $;

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  submitted = false;
  termsAccepted = false;
  countries = ['GB', 'Norway', 'France', 'Serbia'];
  userTypes = [
    {'description':'Common_labels.Farmer', 'value':'Farmer'},
    {'description':'Common_labels.Advisor', 'value':'Advisor'},
    {'description':'Common_labels.Developer', 'value':'Developer'},
  ];
  errors: any = [];
  subscriptionErrors: Subscription;
  successMsg: string;
  isSuccess;
  @ViewChild('registrationModal', {static: false}) public registrationModal: TemplateRef<any>;
  modalRef: any;
  confirmationMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private modalService: BsModalService,
    private _cmsService: CMSService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group(
      {
        userType: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")]],
        password: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern("^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d][A-Za-z\\d!@#$%^&*()_+]{6,}$")
          ]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );

    let promises = [
      this._cmsService.getRegistrationConfirmationMessage()
        .then((rcMessage: any) => {
          let languageFound: boolean = false;
          for (let key in rcMessage) {
            if(key === sessionStorage.getItem("selectedLanguage"))
            {
              this.confirmationMessage = this._sanitizer.bypassSecurityTrustHtml(rcMessage[key]);
              languageFound = true;
              if (rcMessage[key]==="") {
                this.confirmationMessage = this._sanitizer.bypassSecurityTrustHtml(rcMessage["en"]);
              }
            }
          }
          if(!languageFound) {
            this.confirmationMessage = this._sanitizer.bypassSecurityTrustHtml(rcMessage["en"]);
          }
        }),
    ];
    Promise.all(promises).then(() => {
      setTimeout(() => init(), 0)
    })

    this.subscriptionErrors = this.authService.getErrors().subscribe
    (error => {
      if(error) {
        this.errors.push(error);
      } 
    })

    /*this.authService.errors.subscribe(errors => {
      this.errors = errors;
    });*/

  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.termsAccepted = true;
    this.errors = [];
    this.successMsg = '';
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  removeAcceptedTerms(removeTerms: boolean) {
    this.termsAccepted = removeTerms;
    this.modalRef = this.modalService.show(this.registrationModal);
    this.onReset();
  }

  ngOnDestroy() {
    this.subscriptionErrors.unsubscribe();
}
}
