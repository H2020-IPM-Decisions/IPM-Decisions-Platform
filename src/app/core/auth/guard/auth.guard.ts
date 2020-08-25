import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { map, take } from 'rxjs/operators';
import { toUnicode } from 'punycode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthenticationService, private _router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree
    | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
      return true;

    if (this._authService.isLoggedIn()) {

      return this._authService.account$.pipe(
        take(1),
        map(acct => {
          if (acct) {
            if (acct.roles && acct.roles.length > 0) {
              const roles: string[] = route.data.roles;

              if (roles && (roles.some((role: string) => acct.roles.includes(role)))) {
                return true;
              }
            }

            if (acct.claims && acct.claims.length > 0) {
              const claims: string[] = route.data.claims;

              if (claims && (claims.some((claim: string) => acct.claims.includes(claim)))) {
                return true;
              }
            }
          }

        })
      );
    }
    return this._router.createUrlTree(['/']);

  }
}

