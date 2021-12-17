import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, empty } from 'rxjs';
import { catchError, tap, switchMap} from 'rxjs/operators';

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

    const token = sessionStorage.getItem("token");

    if (!token) {
      return next.handle(request);
    }

    request = this.addToken(request, token);
    request = this.addContentLanguage(request);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {

          return this.handle401Error(request, next).pipe(
            switchMap((res) => {
              request = this.addToken(request, res.body.token);
              request = this.addContentLanguage(request);
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
    let refreshToken = sessionStorage.getItem('refresh_token');

    if (refreshToken) {
      return this.authService.authenticateWithRefreshToken(refreshToken).pipe(
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

  // Add Translation Header to all requests
  private addContentLanguage(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        'Accept-Language':sessionStorage.getItem('selectedLanguage')
      }
    });
  }

}