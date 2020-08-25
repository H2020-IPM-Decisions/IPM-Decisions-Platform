import { UserEmail } from './../../models/user-email.model';
import { RegistrationEmail } from './../../models/registration-email.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }
  sendRegistrationEmail(data: RegistrationEmail): Observable<any> {
    const url = environment.apiUrl + '/api/eml/accounts/registrationemail';
    return this.http.post<RegistrationEmail>(url, data, {
      headers: {
        'Content-Type': 'application/vnd.h2020ipmdecisions.email+json',        
        'ipm-eml-auth' : '1234'
      }
    });
  }

  forgotPasswort(email: any): Observable<any> {

    return this.http.post<any>(environment.apiUrl + '/api/eml/accounts/forgotpassword', email, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }


}
