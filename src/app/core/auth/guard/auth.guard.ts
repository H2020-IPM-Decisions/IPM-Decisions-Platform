import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authenticationService: AuthenticationService, 
    private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  :boolean
  | UrlTree
  | Promise<boolean | UrlTree>
  | Observable<boolean | UrlTree> {

    return this.authenticationService.currentUserSubject.pipe(
      take(1),
      map(user => {

        if(user && user.role) {
          if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
            return this.router.createUrlTree(['/']);
          }
        }
        
        if(user && user.userType) {
          if (route.data.userTypes && route.data.userTypes.indexOf(user.userType) === -1) {
            return this.router.createUrlTree(['/']);
          }
        }
        
        if (!!user) {
          return true;
        }

        return this.router.createUrlTree(['/']);
      })
    )
  }
   
}
