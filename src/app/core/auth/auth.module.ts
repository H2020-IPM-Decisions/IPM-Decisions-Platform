import { LoadingSpinnerComponent } from './../../shared/loading-spinner/loading-spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { TermsComponent } from './pages/terms/terms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './guard/auth.guard';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule} from '@ngx-translate/core';
import { ResendConfirmationEmailComponent } from './pages/resend-confirmation-email/resend-confirmation-email.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    TermsComponent,
    LoadingSpinnerComponent,
    ResendConfirmationEmailComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    AuthGuard
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    TermsComponent,
    LoadingSpinnerComponent,
    TranslateModule,
    ResendConfirmationEmailComponent

  ]
})
export class AuthModule { }
