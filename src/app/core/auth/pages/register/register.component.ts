import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match.validator';


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
  errors: string[] = [];
  constructor(private formBuilder: FormBuilder, private router:Router, private authService: AuthenticationService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        // firstName: ['', Validators.required],
        // lastName: ['', Validators.required],
        // userType: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        // phone: ['', Validators.required],
        // mobile: ['', Validators.required],
        // address: ['', Validators.required],
        // postalCode: ['', Validators.required],
        // country: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        // confirmPassword: ['', Validators.required],
        firstName: [''],
        lastName: [''],
        userType: [''],
        // email: [''],
        phone: [''],
        mobile: [''],
        address: [''],
        postalCode: [''],
        country: [''],
        // password: ['',],
        confirmPassword: [''],
      },
      {
        // validator: MustMatch('password', 'confirmPassword')
      }
    );

    this.authService.errors.subscribe(errors => {
      console.log("sa tersa" , errors);
      
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
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }  

  removeAcceptedTerms(removeTerms:boolean) {
    this.termsAccepted = removeTerms; 
  }
}
