import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';

import { Account } from './../models/account.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private isRefreshing: boolean;
  // private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private injector: Injector, private authService: AuthenticationService) {
    this.isRefreshing = false;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let sessionDetails = this.authService.getUserSession();

    if (sessionDetails.token) {
      request = this.addToken(request, sessionDetails.token);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401 && !this.isRefreshing) {

          return this.handle401Error(request, next).pipe(
            switchMap((res) => {
              request = this.addToken(request, res.body.token);
              return next.handle(request);
            }),
            catchError((err: any) => {
              this.authService.logout();
              return empty();
            })
          );
        }

        return throwError(error);

      })
    );
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.isRefreshing = true;
    let userDetails: Account = this.authService.getUserSession();

    if (userDetails) {
      return this.authService.authenticateWithRefreshToken(userDetails.refreshToken).pipe(
        tap(() => {
          this.isRefreshing = false;
        })
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

}