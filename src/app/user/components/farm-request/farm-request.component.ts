import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'farm-request',
  templateUrl: './farm-request.component.html',
  styleUrls: ['./farm-request.component.css']
})
export class FarmRequestComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private modalService: BsModalService
  ) { }

  email = "";
  message = "";
  @ViewChild('farmRequestModal', {static: false}) public farmRequestModal: TemplateRef<any>;
  modalRef: any;

  sendRequest() {
    this.http.post(
      `${environment.apiUrl}/api/upr/datashare`,
      {
        "email": this.email
      }
    ).toPromise()
      .then(response => this.message = "Common_labels.Success")
      .catch(response => this.message = response.error.message)
      .then(() => this.modalRef = this.modalService.show(this.farmRequestModal))
  }

  ngOnInit() {
  }

}
