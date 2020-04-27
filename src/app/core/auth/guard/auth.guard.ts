import { Account } from './../models/account.model';
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

    return this.authenticationService.currentAccountSubject.pipe(
      take(1),
      map((userAccount: Account) => {

        if(userAccount && userAccount.role) {
          if (route.data.roles && route.data.roles.indexOf(userAccount.role) === -1) {
            return this.router.createUrlTree(['/']);
          }
        }
        
        if(userAccount && userAccount.userAccessType) {
          if (route.data.userTypes && route.data.userTypes.indexOf(userAccount.userAccessType) === -1) {
            return this.router.createUrlTree(['/']);
          }
        }
        
        if (!!userAccount) {
          return true;
        }

        return this.router.createUrlTree(['/']);
      })
    )
  }
   
}
