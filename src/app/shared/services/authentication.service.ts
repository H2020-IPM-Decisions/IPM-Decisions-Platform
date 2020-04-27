import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

import { environment } from 'src/environments/environment';
import { UserForAuthentication } from '@app/core/auth/models/user-for-authentication.model';
import { UserForRegistration } from '@app/core/auth/models/user-for-registration.model';
import { User } from '@app/core/auth/models/user.model';
import { Account } from './../../core/auth/models/account.model';
import { Authentication } from './../../core/auth/models/authentication.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    currentAccountSubject = new BehaviorSubject<Account>(null);
    public currentAccount: Observable<Account>;
    public errors = new Subject<string[]>();
    tokenExpirationTimer: any;

    constructor(private http: HttpClient) {  
        this.currentAccountSubject = new BehaviorSubject<Account>(JSON.parse(window.sessionStorage.getItem('user')));
        this.currentAccount = this.currentAccountSubject.asObservable();
    }

    public get currentUserValue(): Account {
        return this.currentAccountSubject.value;
    }
    register(registrationData: UserForRegistration):Observable<User> {

        const url: string = `${environment.apiUrl}/idp/api/authorization/register`;
    
        return this.http.post<User>(url, registrationData)
            .pipe(    
                catchError( (errorRes) => {
                    // console.log("errorRes", errorRes);
                    let errorMessage = 'An unknown error occured!';
                    if(!errorRes.error || !errorRes.error.errors) {
                        this.errors.next([errorMessage]);
                    }

                    this.errors.next(errorRes.error.errors);
                    return throwError(errorRes.error.errors);
                })                          
            );
    }

    login(userForAuthentication: UserForAuthentication):Observable<Authentication> {

        const url:string = `${environment.apiUrl}/idp/api/authorization/authenticate`;

        const headers = { 
            'Content-Type':'application/json',
            'Accept':'application/json',
            'grant_type':'password',
            'client_id':'08d7aa5b-e23c-496e-8946-6d8af6b98dd6',
            'client_secret':'bpjiu9ticX8TB0owtMESxM27iQdp9iX_b4RpZ8VAujA' 
        };

        return this.http.post<Authentication>(url, userForAuthentication, { headers })
            .pipe(
                catchError(this.handleError), 
                tap(response => {

                    const decoded = jwt_decode(response.token);
                    // console.log("decoded", decoded);
                    const currentAccount: Account = new Account(  
                        decoded['sub'],
                        userForAuthentication.email,
                        decoded['nbf'],
                        decoded['exp'],
                        response.token,
                        decoded['UserAccessType'],
                        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
                        // decoded['iss'],
                        // decoded['aud']
                    );
                    // const auth : Authentication = {
                    //     id: response.id,
                    //     email: response.email,
                    //     roles: response.roles,
                    //     claims: response.claims,
                    //     token: response.token,
                    //     tokenType: response.tokenType,
                    //     bearer: response.bearer,
                    //     refreshToken: response.refreshToken
                    // } 
          
                    this.currentAccountSubject.next(currentAccount);
                    const expirationDuration = currentAccount.tokenExpiration - currentAccount.tokenInit;
                    this.autoLogout(expirationDuration);
                    window.sessionStorage.setItem('user', JSON.stringify(currentAccount));
                }) 
            );
    }

    autoLogin() {
        const accountData: Account = JSON.parse(window.sessionStorage.getItem('user'));

        if(!accountData) { return; }

        const loadedAccount: Account = new Account(  
            accountData.id,
            accountData.email,
            accountData.tokenInit,
            accountData.tokenExpiration,
            accountData.token,
            accountData.userAccessType,
            accountData.role            
        );

        if(loadedAccount.token) {
            this.currentAccountSubject.next(loadedAccount);
            const expirationDuration = loadedAccount.tokenExpiration - loadedAccount.tokenInit;
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        window.sessionStorage.removeItem('user');
        this.currentAccountSubject.next(null);
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        const duration = expirationDuration * 1000;
        this.tokenExpirationTimer = setTimeout(()=>{
            this.logout();            
        }, duration);
    }

    private handleError(errorRes: HttpErrorResponse) {

        let errorMessage = 'An unknown error occured!';
        if(!errorRes.error || !errorRes.error.message) {
            console.log("err", errorRes);
            
            return throwError(errorMessage);
        }
        console.log("err", errorRes);
        return throwError(errorRes.error.message);
    }
}
