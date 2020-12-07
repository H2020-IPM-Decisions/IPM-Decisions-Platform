import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'farm-share',
  templateUrl: './farm-share.component.html',
  styleUrls: ['./farm-share.component.css']
})
export class FarmShareComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private modalService: BsModalService
  ) { }

  items;
  message = "";
  @ViewChild('farmShareModal', { static: false }) public farmShareModal: TemplateRef<any>;
  modalRef: any;

  ngOnInit() {
    this.updateList();
  }

  updateList() {
    return this.http.get(
      `${environment.apiUrl}/api/upr/datashare`, {
        observe: 'response'
      }
    ).toPromise()
      .then((x: HttpResponse<any>) => {
        this.items = x.body.value;
      })
      .catch((x) => {
        alert(JSON.stringify(x));
      })
  }

  makeRequest(
    requesterId,
    reply
  ) {
    this.http.post(
      `${environment.apiUrl}/api/upr/datashare/reply`,
      {
        "RequesterId": requesterId,
        "Farms": [],
        "Reply": reply,
        "AllowAllFarms": true
      }
    ).toPromise()
      .then((response: any) => {
        this.message = response.message;
        return this.updateList();
      })
      .catch((response: any) => {
        this.message = response.error.message;
        return Promise.resolve();
      })
      .then(() => this.modalRef = this.modalService.show(this.farmShareModal))
  }

}
