import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IDssFlat, IDssResultChart, IDssChartGroup, IDssResultFlat} from './dss-selection.model';
import { DssSelectionService } from './dss-selection.service';
import { NGXLogger } from "ngx-logger";

@Component({
  selector: 'app-dss-detail',
  templateUrl: './dss-detail.component.html',
  styleUrls: ['./dss-detail.component.css']
})
export class DssDetailComponent implements OnInit, OnDestroy {

  $subscription: Subscription;
  $delSubscription: Subscription;
  dssDetail: IDssFlat;
  modalRef: BsModalRef;
  warning: {data:number[],labels:string[],chartInformation:IDssResultChart};
  dssChartGroups: IDssChartGroup[] = [];
  selectedDssChartGroup: IDssChartGroup;
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private _modalService: BsModalService,
    private service: DssSelectionService,
    private toastrService: ToastrService,
    private _router: Router,
	  private _logger: NGXLogger
	) { }
  
  ngOnInit() {
    this.$subscription = this.activatedRoute.data.subscribe(({ dssDetail }) => {
      	this.dssDetail = dssDetail;
		this.dssChartGroups = this.dssDetail.chartGroups;
	    this.selectedDssChartGroup = this.dssChartGroups[0];
      if(this.dssDetail.warningStatusPerDay){
		    /*let labels = [];
        for(let i=0; i<this.dssDetail.warningStatusPerDay.length; i++){
          labels.push(this.dssDetail.outputTimeStart);
        }*/
		    this.warning = this.service.getDssWarningChart(this.dssDetail.warningStatusPerDay, this.dssDetail.warningStatusLabels);
	    }
    });
  }

  goBack(): void {
    window.history.back();
  }

  delete(): void{
    if(!this.dssDetail) return;
    this.$delSubscription = this.service.del(this.dssDetail.id).subscribe(()=>{
      this.toastrService.success("Operation Success","DSS Deleted");
      this.modalRef.hide();
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

  onChangeChartGroup(selectedChart){
	this.selectedDssChartGroup = selectedChart
  }

  openModal(template: TemplateRef<any>, size?: string) {
    this.modalRef = this._modalService.show(template, {class: size});
  }

  goToModelParametrisation(): void {
    const navigationExtras: NavigationExtras = { 
      state: { 
        data: {
          dssId: this.dssDetail.dssId, 
          dssModelId: this.dssDetail.dssModelId,
          dssModelName: this.dssDetail.dssModelName,
          farmName: this.dssDetail.farmName,
          dssDetailPage: true
        }
      }
    };
    this._router.navigate(['/user/farm',this.dssDetail.farmId,'edit','dss',this.dssDetail.id,'parametrisation'], navigationExtras);
  }
}
