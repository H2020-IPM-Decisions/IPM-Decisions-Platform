import { Authentication } from './../../models/authentication.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Role } from './../../models/role.enum';
import { UserForAuthentication } from '../../models/user-for-authentication.model';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  forgotPass = false;
  loading = false; //todo
  returnUrl: string;
  errors: string[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router, 
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")]],
        // email: ['', [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]],
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

          console.log("Authentication", res);
          
          this.loading = false;
          if(this.authenticationService.currentUserValue.role === Role.Admin) { //todo
            this.router.navigate(["/admin"]);
          } else {
            this.router.navigate(["/user/farm/list"]);
          }
        },
      error: 
        (errorMessages: any) => {
          this.loading = false;
          this.errors = [errorMessages];
        }
    }

    this.authenticationService.login(userForAuthentication)
    .pipe(first())
    .subscribe(loginObsever);
    
  }

  forgotPassword(){
    this.forgotPass = true;
  }
}
