import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

import { AuthenticationService } from "../services/authentication.service";
import { map, take } from "rxjs/operators";
import { toUnicode } from "punycode";
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthenticationService,
    private _router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    if (this._authService.isLoggedIn()) {

      const acct: any = this._authService.setUserAccount(sessionStorage.getItem("token"));

      if (acct) {
        if (acct.roles && acct.roles.length > 0) {
          const roles: string[] = route.data.roles;
          if (
            roles &&
            roles.some((role: string) => acct.roles.includes(role))
          ) {
            return true;
          }
        }

        if (acct.useraccesstype && acct.useraccesstype.length > 0) {
          const claims: string[] = route.data.claims;

          // Multiple role users contains an array inside the useraccesstype
          if (Array.isArray(acct.useraccesstype[0])) {
            acct.useraccesstype = acct.useraccesstype[0];
          }
          if (
            claims &&
            claims.some((claim: string) => acct.useraccesstype.includes(claim))
          ) {
            return true;
          }
        }
      }
    }
    return this._router.createUrlTree(["/"]);
  }
}
