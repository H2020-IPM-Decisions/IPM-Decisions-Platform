import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl} from '@angular/forms';
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
    {'description':'Common_labels.Researcher', 'value':'Researcher'},
    {'description':'Common_labels.Developer', 'value':'Developer'},
  ];
  errors: any = [];
  subscriptionErrors: Subscription;
  successMsg: string;
  isSuccess;
  @ViewChild('registrationModal', {static: false}) public registrationModal: TemplateRef<any>;
  modalRef: any;
  confirmationMessage: any;
  userTypeIsSelected: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private modalService: BsModalService,
    private _cmsService: CMSService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {

    this.initForm();

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

  initForm() {
    this.registerForm = this.formBuilder.group(
      {
        userType: this.formBuilder.array([], [Validators.required]),
        //userType: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")]],
        password: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern("^(?=(?:[^a-z]*[a-z]))(?=.*[A-Z])(?=(?:[^0-9]*[0-9]))(?=.*[!-\/:-@\[-`{-~]).{6,}$")
          ]],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
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
    //this.registerForm.reset();
    this.initForm();
  }

  removeAcceptedTerms(removeTerms: boolean) {
    this.termsAccepted = removeTerms;
    this.modalRef = this.modalService.show(this.registrationModal);
    this.onReset();
  }

  ngOnDestroy() {
    this.subscriptionErrors.unsubscribe();
  }

  onCheckboxChange(e) {
    const userTypeArray: FormArray = this.registerForm.get('userType') as FormArray;
    userTypeArray.markAsTouched();
    if (e.target.checked) {
      userTypeArray.push(new FormControl(e.target.value));
      this.userTypeIsSelected = true
    } else {
      let i: number = 0;
      userTypeArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          userTypeArray.removeAt(i);
          if(userTypeArray.length < 1) {
            this.userTypeIsSelected = false;
          }
          return;
        }
        i++;
      });
    }
  }
}
