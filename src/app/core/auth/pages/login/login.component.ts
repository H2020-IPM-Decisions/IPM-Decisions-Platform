import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserForAuthentication } from '../../models/user-for-authentication.model';
import { Authentication } from './../../models/authentication.model';
import { AuthenticationService } from '../../services/authentication.service';
import { Role } from '../../enums/role.enum';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPass = false;
  loading = false;
  returnUrl: string;
  errors: string[] = [];
  isVerified: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    console.log("fg", this.isVerified);

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
    this.returnUrl = this._activatedRoute.snapshot.queryParams['returnUrl'] || '';
  }

  setVerified(val: boolean) {
    console.log("dd", val);
    
    this.isVerified = val;
  }

  get f() {
    return this.loginForm.controls;
  }
  onLogin() {
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
            this.router.navigate(["/user/farm/list"]);
          }
        },
      error:
        (errorMessages: any) => {
          this.loading = false;
          console.log(errorMessages);

          this.errors = [errorMessages];
        }
    }

    if(this.authenticationService.login(userForAuthentication)) {
      this.loading = false;
      const hasRoles = this.authenticationService.currentUserValue.roles;
      if (hasRoles && hasRoles.includes(Role.Admin)) {
        this.router.navigate(["/admin"]);
      } else {
        this.router.navigate(["/user/farm/list"]);
      }
    }

  }

  forgotPassword() {
    this.forgotPass = true;
  }
}
