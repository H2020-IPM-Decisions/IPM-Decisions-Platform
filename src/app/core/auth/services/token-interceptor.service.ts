import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authenticationService = this.injector.get(AuthenticationService); 
    // const currentUser = authenticationService.currentUserValue;

    return authenticationService.currentUserSubject.pipe(
      take(1),
      exhaustMap( (user: User) => { 

        if(!user) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${user.token}`
                // Authorization: `Bearer ${window.sessionStorage.getItem('token')}`
            }
        });

        return next.handle(modifiedReq);
      })
    )
  }
}
