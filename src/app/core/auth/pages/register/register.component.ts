import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match.validator';
import { AuthenticationService } from '../../services/authentication.service';
import { BsModalService } from 'ngx-bootstrap/modal';
declare var $;

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  termsAccepted = false;
  countries = ['GB', 'Norway', 'France', 'Serbia'];
  userTypes = ['Farmer', 'Advisor', 'Developer'];
  errors: any = [];
  successMsg: string;
  isSuccess;
  @ViewChild('registrationModal', {static: false}) public registrationModal: TemplateRef<any>;
  modalRef: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private modalService: BsModalService
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

    this.authService.errors.subscribe(errors => {
      this.errors = errors;
    });

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
}
