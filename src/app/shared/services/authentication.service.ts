import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap} from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { User } from '@app/core/auth/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    currentUserSubject = new BehaviorSubject<User>(null);
    public currentUser: Observable<User>;

    public errors = new Subject<string[]>();

    constructor(private http: HttpClient) {  
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(window.sessionStorage.getItem('user')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {

        const url = `${environment.apiUrl}/idp/api/authorization/authenticate`;

        const headers = { 
            'Content-Type':'application/json',
            'Accept':'application/json',
            'grant_type':'password',
            'client_id':'08d7aa5b-e23c-496e-8946-6d8af6b98dd6',
            'client_secret':'bpjiu9ticX8TB0owtMESxM27iQdp9iX_b4RpZ8VAujA' 
        };

        return this.http.post<any>(url, { email, password }, { headers } )
            .pipe(
                catchError(this.handleError), 
                tap(response => {
                    const decoded = jwt_decode(response.token);
                    // console.log("decoded", decoded);
                    const currentUser: User = new User(
                        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                        email,
                        decoded['UserAccessType'],
                        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                        response.token,
                        decoded['exp']
                    );
                        // console.log('current user', currentUser);
          
                        this.currentUserSubject.next(currentUser);
                        window.sessionStorage.setItem('user', JSON.stringify(currentUser));
                }) 
            );
    }


    
    register(registrationData: any) {

        const url = `${environment.apiUrl}/idp/api/authorization/register`;
    
        return this.http.post<AuthResponseData>(url, registrationData)
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

    autoLogin() {
        const userData: {
            id: string,
            email: string,
            userType: string,
            role: string,
            _token: string,
            _tokenExpirationDate: number
        } = JSON.parse(window.sessionStorage.getItem('user'));

        if(!userData) { return; }

        const loadedUser = new User(
            userData.id,
            userData.email,
            userData.userType,
            userData.role,
            userData._token,
            userData._tokenExpirationDate   
        );

        if(loadedUser.token) {
            this.currentUserSubject.next(loadedUser);
        }
    }

    logout() {
        window.sessionStorage.removeItem('user');
        this.currentUserSubject.next(null);
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

interface AuthResponseData {
    id: string,
    email: string
}