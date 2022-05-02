import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from "@angular/common/http";
import {
  BehaviorSubject,
  Observable,
  Subject,
  throwError,
  empty,
  of,
} from "rxjs";
import { catchError, tap, shareReplay } from "rxjs/operators";
import * as jwt_decode from "jwt-decode";
import * as bcrypt from "bcryptjs";
import * as moment from "moment";
const saltRounds = 10;

import { environment } from "src/environments/environment";
import { UserForAuthentication } from "@app/core/auth/models/user-for-authentication.model";
import { UserForRegistration } from "@app/core/auth/models/user-for-registration.model";
import { User } from "@app/core/auth/models/user.model";
import { Account } from "../models/account.model";
import { Authentication } from "../models/authentication.model";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  account: Account;
  private currentAccountSubject = new BehaviorSubject<Account>(null);
  public account$: Observable<Account> = this.currentAccountSubject.asObservable();
  private errors = new Subject<any[]>();

  constructor(private http: HttpClient, private router: Router) {}

  public get currentUserValue(): Account {
    return this.currentAccountSubject.value;
  }

  register(registrationData: UserForRegistration): Observable<User> {
    const url: string = `${environment.apiUrl}/api/idp/authorization/register`;
    // registrationData.password = this.hashPassword(registrationData.password);

    const headers = {
      'Accept-Language':sessionStorage.getItem('selectedLanguage')
    };

    return this.http.post<User>(url, registrationData,{ headers }).pipe(
      catchError((errorRes) => {
        let errorMessage = {"code":"UnknownError","description":"Error_messages.An_unknown_error_occured"};
        if (!errorRes.error || !errorRes.error.errors) {
          this.errors.next([errorMessage]);
        }

        this.errors.next(errorRes.error.errors);
        return throwError(errorRes.error.errors);
      })
    );
  }

  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  login(
    userForAuthentication: UserForAuthentication
  ): Observable<Authentication> {
    // const url:string = `${environment.apiUrl}/api/idp/authorization/authenticate`;
    // this.http.get(`${environment.apiUrl}/idp/api/authorization/authenticate`).pipe(
    // first(),
    // map(user => {
    //     if (!user) {
    //         this.handleError;
    //     }
    //     return bcrypt.compare(userForAuthentication.password, 'hashed password here');
    // }),
    // tap(user => {
    return this.doLogin(userForAuthentication);
    // })
    // )
  }

  doLogin(
    userForAuthentication: UserForAuthentication
  ): Observable<Authentication> {
    const url: string = `${environment.apiUrl}/api/idp/authorization/authenticate`;

    const headers = {
      "Content-Type": "application/json",
      'Accept-Language':sessionStorage.getItem('selectedLanguage'),
      Accept: "application/json",
      grant_type: "password",
      client_id: "08d7aa5b-e23c-496e-8946-6d8af6b98dd6",
      client_secret: "bpjiu9ticX8TB0owtMESxM27iQdp9iX_b4RpZ8VAujA",
    };

    return this.http
      .post<Authentication>(url, userForAuthentication, { headers })
      .pipe(
        shareReplay(),
        catchError((err: HttpErrorResponse) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.router.navigate(["/"]);
            }
          }
          return throwError(err);
        }),
        catchError(this.handleError),
        //                 map(response => {
        //                    if(response && response.token) {
        //                        window.sessionStorage.setItem('token', response.token);
        //                     //    return true;
        //                     this.currentAccountSubject.next(currentAccount);

        //                    }

        //                 //    return false;

        //                 }),

        tap((response: Authentication) => {
          let account = this.setUserAccount(response.token);
          account.refreshToken = response.refreshToken;
          this.currentAccountSubject.next(account);
          this.setSession(account);
        })
      );
  }

  setUserAccount(token: string): Account {
    const decoded = jwt_decode(token);
    if (decoded) {
      const userAccessType = decoded["useraccesstype"]
        ? [decoded["useraccesstype"]]
        : null;
      const role = decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ]
        ? [
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
          ]
        : null;

      const account: Account = {
        id: decoded["sub"],
        email:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        token: token,
        tokenInit: decoded["iat"],
        tokenExpiration: decoded["exp"],
        useraccesstype: userAccessType,
        roles: role
      };

      return account;
    }
  }

  private setSession(authResult: Account) {
    sessionStorage.setItem("token", authResult.token);
    sessionStorage.setItem(
      "expires_at",
      JSON.stringify(authResult.tokenExpiration)
    );
    sessionStorage.setItem("refresh_token", authResult.refreshToken);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = sessionStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment.unix(expiresAt);
  }

  public getExpirationAsSeconds(): number {
    const expiration = sessionStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    const duration = moment.duration(moment.unix(expiresAt).diff(moment()));
    var result: number = +duration.asSeconds().toFixed();
    return result;
  }

  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("expires_at");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("hasDSS");
    this.currentAccountSubject.next(null);
    this.router.navigate(["/"]);
    location.reload();
  }

  authenticateWithRefreshToken(refreshToken: string) {
    const url: string = `${environment.apiUrl}/api/idp/authorization/authenticate/token`;

    return this.http
      .post<any>(url, null, {
        headers: {
          "Content-Type": "application/json",
          'Accept-Language':sessionStorage.getItem('selectedLanguage'),
          Accept: "application/json",
          grant_type: "refresh_token",
          client_id: "08d7aa5b-e23c-496e-8946-6d8af6b98dd6",
          client_secret: "bpjiu9ticX8TB0owtMESxM27iQdp9iX_b4RpZ8VAujo",
          refresh_token: refreshToken,
        },
        observe: "response",
      })
      .pipe(
        tap((resp: HttpResponse<any>) => {
          if (resp) {
            let tokenCreated = moment().unix();
            let account: Account = {
              id: resp.body.id,
              email: resp.body.email,
              token: resp.body.token,
              tokenInit: tokenCreated,
              tokenExpiration: tokenCreated + 4800,
              refreshToken: resp.body.refreshToken,
              useraccesstype: resp.body.claims,
              roles: resp.body.roles,
            };

            this.setSession(account);
          }
        })
      );
  }

  autoLogin() {
    const token: string = sessionStorage.getItem("token");
    if (!token) return null;

    const decoded = jwt_decode(token);

    if (decoded) {
      const role = decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ]
        ? [
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
          ]
        : null;

      const account: Account = {
        id: decoded["sub"],
        email:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        token: token,
        tokenInit: decoded["iat"],
        tokenExpiration: decoded["exp"],
        refreshToken: sessionStorage.getItem("refresh_token"),
        useraccesstype: decoded["useraccesstype"],
        roles: role,
      };
      if (account) {
        this.currentAccountSubject.next(account);
      }
    }
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "Error_messages.Services_not_responding";

    if (!errorRes.error || !errorRes.error.message) {
      return throwError(errorMessage);
    }
    let errObj: object = {
      message: errorRes.error.message,
      identityErrorType: errorRes.error.identityErrorType
    };
    return throwError(errObj);
  }

  public isAdmin(): boolean {
    if (this.currentUserValue.roles && this.currentUserValue.roles.length > 0) {
      return this.currentUserValue.roles.includes("Admin");
    }
  }

  public getErrors(): Observable<any> {
    return this.errors.asObservable();
  }
}
