import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
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
  userTypes = ['Farmer', 'Advisor', 'Admin'];
  constructor(private formBuilder: FormBuilder, private router:Router) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userType: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        mobile: ['', Validators.required],
        address: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
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
      console.log('false');
      return;
    }
    console.log('register/terms');
    this.termsAccepted = true;
    console.log(this.termsAccepted);
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
}
