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
        email: ['', [Validators.required, Validators.pattern("^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$")]],
        // email: ['', [Validators.required, Validators.pattern('^(([^<>()\\[\\]\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$')]],
        password: ['', [Validators.required, Validators.minLength(6),Validators.pattern(".*(?=^.{6,}$)(?=[^\\d]*\\d)(?=[^\\W]*\\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z]).*")]]
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
