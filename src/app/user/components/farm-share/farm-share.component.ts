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
  pagination:any = {};
  currentPage = 1;
  @ViewChild('farmShareModal') public farmShareModal: TemplateRef<any>;
  modalRef: any;

  ngOnInit() {
    this.updateList();
  }

  updateList() {
    return this.http.get(
      `${environment.apiUrl}/api/upr/datashare?pageSize=5&pageNumber=${this.currentPage}`, {
        observe: 'response'
      }
    ).toPromise()
      .then((x: HttpResponse<any>) => {
        this.pagination = JSON.parse(x.headers.get('x-pagination'));
        this.items = x.body.value;
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
        return this.updateList();
      })
      .catch((response: any) => {
        this.message = response.error.message;
        this.modalRef = this.modalService.show(this.farmShareModal);
      })
  }

  getNextPage() {
    this.currentPage++;
    return this.updateList();
  }

  hasNextPage() {
    return this.pagination["HasNext"];
  }

  getPreviousPage() {
    this.currentPage--;
    return this.updateList();
  }

  hasPreviousPage() {
    return this.pagination["HasPrevious"];
  }

}
