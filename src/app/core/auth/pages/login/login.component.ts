import { Role } from './../../models/role.enum';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { first } from 'rxjs/operators';

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
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
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
      console.log("invalid login form")
      return;
    }

    const email = (<string>this.f.email.value).toLowerCase();
    const password = this.f.password.value;
    this.loading = true;

    const loginObsever = {
      next: 
        (res: any) => {
          this.loading = false;
          
          if(this.authenticationService.currentUserValue.role === Role.Admin) {
            this.router.navigate(["/admin"]);
          } else {
            this.router.navigate(["/user/farm"]);
          }
        },
      error: 
        (errorMessages: any) => {
          this.loading = false;
          this.errors = [errorMessages];
        }
    }

    this.authenticationService.login(email, password)
    .pipe(first())
    .subscribe(loginObsever);
    
  }

  forgotPassword(){
    this.forgotPass = true;
  }
}
