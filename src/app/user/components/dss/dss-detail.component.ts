import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IDssFlat } from './dss-selection.model';
import { DssSelectionService } from './dss-selection.service';
import dssFakeJson from './fake/dss-result.json';
@Component({
  selector: 'app-dss-detail',
  templateUrl: './dss-detail.component.html',
  styleUrls: ['./dss-detail.component.css']
})
export class DssDetailComponent implements OnInit, OnDestroy {

  $subscription: Subscription;
  $delSubscription: Subscription;
  dssDetail: IDssFlat;
  dssDetailOriginal: IDssFlat;
  deleteDssModalRef: BsModalRef;
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private modalService: BsModalService,
    private service: DssSelectionService,
    private toastrService: ToastrService) { }
  
  ngOnInit() {
    this.$subscription = this.activatedRoute.data.subscribe(({ dssDetail }) => {
      // TODO remove when get real data
      this.dssDetailOriginal = dssDetail;
      this.dssDetail = dssFakeJson;
    });
  }

  goBack(): void {
    window.history.back();
  }

  openModal(template) {
    this.deleteDssModalRef = this.modalService.show(template);
  }

  delete(): void{
    if(!this.dssDetailOriginal) return;
    this.$delSubscription = this.service.del(this.dssDetailOriginal.id).subscribe(()=>{
      this.toastrService.success("Operation Success","DSS Deleted");
      this.deleteDssModalRef.hide();
      window.history.back();
    },()=>{
      this.toastrService.error("Operation Failed","No DSS deleted");
    });
  }

  ngOnDestroy(): void {
    if(this.$subscription){
      this.$subscription.unsubscribe();
    }
  }
}
