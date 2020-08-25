import { environment } from './../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farm-request',
  templateUrl: './farm-request.component.html',
  styleUrls: ['./farm-request.component.css']
})
export class FarmRequestComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  email = "";

  sendRequest() {
    this.http.post(
      `${environment.apiUrl}/api/upr/datashare`,
      {
        "email": this.email
      }
    ).toPromise()
      .catch( x => x) 
      .then(
        (response) => { alert(JSON.stringify(response)); }
      )
  }

  ngOnInit() {
  }

}
