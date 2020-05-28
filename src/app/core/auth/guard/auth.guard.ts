import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthenticationService,
    private _router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {

    if (this._authService.isLoggedIn()) {

      let session = this._authService.getUserSession();
      if (session) {
        if (session.roles && session.roles.length > 0) {
          const allRoles: string[] = route.data.roles;

          if (allRoles && !(allRoles.some((role: string) => session.roles.includes(role)))) {
            return this._router.createUrlTree(['/']);
          }
        }

        if (session.claims && session.claims.length > 0) {
          const allClaims: string[] = route.data.claims;

          if (allClaims && !(allClaims.some((claim: string) => session.claims.includes(claim)))) {
            return this._router.createUrlTree(['/']);
          }
        }
      }
      return true;
    }

    return this._router.createUrlTree(['/']);
  }

}
