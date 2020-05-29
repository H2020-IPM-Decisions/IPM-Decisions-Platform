import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError, empty, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import * as bcrypt from 'bcryptjs';
const saltRounds = 10;

import { environment } from 'src/environments/environment';
import { UserForAuthentication } from '@app/core/auth/models/user-for-authentication.model';
import { UserForRegistration } from '@app/core/auth/models/user-for-registration.model';
import { User } from '@app/core/auth/models/user.model';
import { Account } from '../models/account.model';
import { Authentication } from '../models/authentication.model';
import { observe } from 'fast-json-patch';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    currentAccountSubject = new BehaviorSubject<Account>(null);
    public currentAccount: Observable<Account>;
    public errors = new Subject<string[]>();
    tokenExpirationTimer: any;

    constructor(private http: HttpClient, private _router: Router) {
        this.currentAccountSubject = new BehaviorSubject<Account>(JSON.parse(window.sessionStorage.getItem('user')));
        this.currentAccount = this.currentAccountSubject.asObservable();
    }

    public get currentUserValue(): Account {
        return this.currentAccountSubject.value;
    }

    register(registrationData: UserForRegistration): Observable<User> {

        const url: string = `${environment.apiUrl}/api/idp/authorization/register`;
        // registrationData.password = this.hashPassword(registrationData.password);

        return this.http.post<User>(url, registrationData)
            .pipe(
                catchError((errorRes) => {
                    let errorMessage = 'An unknown error occured!';
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

    login(userForAuthentication: UserForAuthentication): Observable<Authentication> {
        // const url:string = `${environment.apiUrl}/api/idp/authorization/authenticate`;
        let obs: Observable<Authentication> = new Observable;
        // this.http.get(`${environment.apiUrl}/idp/api/authorization/authenticate`).pipe(
        // first(),
        // map(user => {
        //     if (!user) {
        //         this.handleError;
        //     }
        //     return bcrypt.compare(userForAuthentication.password, 'hashed password here');
        // }),
        // tap(user => {
        obs = this.doLogin(userForAuthentication);
        // })
        // )
        return obs;

    }

    doLogin(userForAuthentication: UserForAuthentication): Observable<Authentication> {

        const url: string = `${environment.apiUrl}/api/idp/authorization/authenticate`;

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'grant_type': 'password',
            'client_id': '08d7aa5b-e23c-496e-8946-6d8af6b98dd6',
            'client_secret': 'bpjiu9ticX8TB0owtMESxM27iQdp9iX_b4RpZ8VAujA'
        };

        return this.http.post<Authentication>(url, userForAuthentication, { headers })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            this._router.navigate(['/login']);
                        }
                    }
                    return empty();
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
                    const decoded = jwt_decode(response.token);

                    const userAccessType = (decoded['UserAccessType']) ? [decoded['UserAccessType']] : null;
                    const role = (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) ? [decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']] : null;

                    const currentAccount: Account = new Account(
                        decoded['sub'],
                        userForAuthentication.email,
                        decoded['nbf'],
                        decoded['exp'],
                        response.token,
                        response.refreshToken,
                        userAccessType,
                        role
                        // decoded['iss'],
                        // decoded['aud']
                    );

                    this.currentAccountSubject.next(currentAccount);
                    // const expirationDuration = currentAccount.tokenExpiration - currentAccount.tokenInit;

                    // this.autoLogout(expirationDuration);
                    window.sessionStorage.setItem('user', JSON.stringify(currentAccount));
                })
            );
    }

    authenticateWithRefreshToken(refreshToken: string) {

        const url: string = `${environment.apiUrl}/api/idp/authorization/authenticate/token`;

        return this.http.post<any>(url, null, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'grant_type': 'refresh_token',
                'client_id': '08d7aa5b-e23c-496e-8946-6d8af6b98dd6',
                'client_secret': 'bpjiu9ticX8TB0owtMESxM27iQdp9iX_b4RpZ8VAujo',
                'refresh_token': refreshToken
            },
            observe: 'response'
        })
            .pipe(
                tap((res: HttpResponse<any>) => {

                    if (res) {
                        let tokenInit = Math.floor(+new Date() / 1000);
                        let acct: Account = new Account(
                            res.body.id,
                            res.body.email,
                            tokenInit,
                            tokenInit + 4800,
                            res.body.token,
                            res.body.refreshToken,
                            res.body.claims,
                            res.body.roles
                        );
                        window.sessionStorage.setItem('user', JSON.stringify(acct));
                    }
                })
            );
    }

    autoLogin() {
        const accountData: Account = JSON.parse(window.sessionStorage.getItem('user'));

        if (!accountData) { return; }

        const loadedAccount: Account = new Account(
            accountData.id,
            accountData.email,
            accountData.tokenInit,
            accountData.tokenExpiration,
            accountData.token,
            accountData.refreshToken,
            accountData.claims,
            accountData.roles
        );

        if (loadedAccount.token) {
            this.currentAccountSubject.next(loadedAccount);
            const expirationDuration = loadedAccount.tokenExpiration - loadedAccount.tokenInit;
            // this.autoLogout(expirationDuration);
        }
    }

    logout() {
        window.sessionStorage.removeItem('user');
        this.currentAccountSubject.next(null);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        this._router.navigate(['/']);

    }

    // autoLogout(expirationDuration: number) {
    //     let duration = expirationDuration * 1000;

    //     this.tokenExpirationTimer = setTimeout(() => {
    //         this.logout();

    //     }, 10000);
    // }

    private handleError(errorRes: HttpErrorResponse) {

        let errorMessage = 'Services not responding!';

        if (!errorRes.error || !errorRes.error.message) {

            return throwError(errorMessage);
        }
        return throwError(errorRes.error.message);
    }

    public getUserSession(): Account {
        let loggedUser = window.sessionStorage.getItem('user');
        if (!loggedUser) return null;
        return Object.assign(new Account(), JSON.parse(loggedUser));
    }

    public isLoggedIn() {
        let token = window.sessionStorage.getItem('user');
        if (!token) {
            return false;
        }
        return !!token;
    }

    public isAdmin(): boolean {
        if (this.currentUserValue.roles && this.currentUserValue.roles.length > 0) {
            return this.currentUserValue.roles.includes('Admin');
        }
    }

}
