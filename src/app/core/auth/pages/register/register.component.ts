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
  successMsg: string;
  constructor(private formBuilder: FormBuilder, private router:Router, private authService: AuthenticationService) {}

  ngOnInit() {
   
   
    this.registerForm = this.formBuilder.group(
      {
        userType: ['', Validators.required],
        email:    ['', [Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")]],
        password: ['', 
          [
            Validators.required, 
            Validators.minLength(6), 
            Validators.pattern(".*(?=^.{6,}$)(?=[^\\d]*\\d)(?=[^\\W]*\\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z]).*")
          ]], 
        confirmPassword: ['', Validators.required],
        // firstName: ['', Validators.required],
        // lastName: ['', Validators.required],
        // phone: ['', Validators.required],
        // mobile: ['', Validators.required],
        // address: ['', Validators.required],
        // postalCode: ['', Validators.required],
        // country: ['', Validators.required],
       
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
    console.log("kontrola" ,this.registerForm);
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

  removeAcceptedTerms(removeTerms:boolean) {
    this.termsAccepted = removeTerms; 
    if(this.successMsg) {
      this.onReset();
    }
  }
}
