import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Account } from './../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authenticationService = this.injector.get(AuthenticationService); 

    return authenticationService.currentAccountSubject.pipe(
      take(1),
      exhaustMap( (userAccount: Account) => { 

        if(!userAccount) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${userAccount.token}`
            }
        });

        return next.handle(modifiedReq);
      })
    )
  }
}
