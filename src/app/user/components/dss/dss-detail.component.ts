import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { IDssFlat, IDssResultChart, IDssChartGroup, IDssResultFlat} from './dss-selection.model';
import { DssSelectionService } from './dss-selection.service';
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import { HttpResponse } from '@angular/common/http';
import * as $ from 'jquery';

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
  resultMessageType: string;
  resultMessage: string;
  dssIsValid: boolean;
  status: number;
  selectedDays: number = 7;
  isRefreshingRiskChart: boolean = false;
  
  constructor(
    private activatedRoute: ActivatedRoute, 
    private _modalService: BsModalService,
    private service: DssSelectionService,
    private _router: Router,
	  private _logger: NGXLogger,
    private _toastrTranslated: ToastrTranslationService
	) { }
  
  ngOnInit() {
    this.$subscription = this.activatedRoute.data.subscribe(({ dssDetail }) => {
      	this.dssDetail = dssDetail;
        this.status = this.dssDetail.warningStatus;
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
    this.resultMessageType = this.dssDetail.resultMessageType;
    this.resultMessage = this.dssDetail.resultMessage;
    this.dssIsValid = this.dssDetail.isValid;
  }

  goBack(): void {
    //window.history.back();
    this._router.navigate(['/user/dss/dashboard'],{ fragment: this.dssDetail.farmId });
  }

  delete(): void{
    if(!this.dssDetail) return;
    this.$delSubscription = this.service.del(this.dssDetail.id).subscribe(()=>{
      this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_deletion","Common_labels.Success","toast-success");
      this.modalRef.hide();
      window.history.back();
    },()=>{
      this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_deletion_error","Common_labels.Error","toast-error");
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
    this.modalRef = this._modalService.show(template, {class: size, backdrop: false});
    //$(".modal-backdrop.in").css("opacity","0");
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }

  goToModelParameterisation(): void {
    const navigationExtras: NavigationExtras = { 
      state: { 
        data: {
          dssId: this.dssDetail.dssId, 
          dssModelId: this.dssDetail.dssModelId,
          dssModelName: this.dssDetail.dssModelName,
          farmName: this.dssDetail.farmName,
          farmId: this.dssDetail.farmId,
          dssDetailPage: true
        }
      }
    };
    this._router.navigate(['/user/farm',this.dssDetail.farmId,'edit','dss',this.dssDetail.id,'parameterisation'], navigationExtras);
  }

  public daysSelectChanged(event: { target: HTMLInputElement }) {
    this.selectedDays = +event.target.value;
  }

  public onConfirmDays(): void {

    this.isRefreshingRiskChart = true;

    this.$subscription = this.service.get(this.dssDetail.id, this.selectedDays).subscribe((response: HttpResponse<IDssFlat>) => {
      this.dssDetail = response.body;
      this.status = this.dssDetail.warningStatus;
      this.dssChartGroups = this.dssDetail.chartGroups;
      this.selectedDssChartGroup = this.dssChartGroups[0];
      if(this.dssDetail.warningStatusPerDay){
        this.warning = this.service.getDssWarningChart(this.dssDetail.warningStatusPerDay, this.dssDetail.warningStatusLabels);
      }
      this.isRefreshingRiskChart = false;
    });

    this.resultMessageType = this.dssDetail.resultMessageType;
    this.resultMessage = this.dssDetail.resultMessage;
    this.dssIsValid = this.dssDetail.isValid;
  }
}
