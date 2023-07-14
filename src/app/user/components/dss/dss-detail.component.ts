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
import {saveAs} from "file-saver";
import * as moment from 'moment';

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
  selectedDays: number = 30;
  chartLabelsDateFormat: string = "DD/MM/YYYY";
  htmlFormDateFormat: string = "YYYY-MM-DD";
  startDate: string;
  endDate: string;
  minDate: string;
  maxDate: string;
  selectedChartGroupData: number[][];
  selectedChartGroupLabels: string[][];
  startDateFormMax: string;
  aWeekAhead: string;
  isStartDateSelected: boolean = false;
  isEndDateSelected: boolean = false;
  areChartFilteredByDate: boolean = false;
  
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

    this.minDate = moment(this.dssDetail.warningStatusLabels[0], this.chartLabelsDateFormat)
    .format(this.htmlFormDateFormat);

    this.maxDate = moment(this.dssDetail.warningStatusLabels[this.dssDetail.warningStatusLabels.length-1], this.chartLabelsDateFormat)
    .format(this.htmlFormDateFormat);

    this.startDateFormMax = moment(this.dssDetail.warningStatusLabels[this.dssDetail.warningStatusLabels.length-1], this.chartLabelsDateFormat)
    .subtract(7, "days").format(this.htmlFormDateFormat);

    this.initDataAndLalbelsArrayOfSelectedGroupChart();
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

  private initDataAndLalbelsArrayOfSelectedGroupChart(): void{

    this.selectedChartGroupData = [];
    this.selectedChartGroupLabels = [];
    for(let resultParameter of this.selectedDssChartGroup.resultParameters){
      this.selectedChartGroupData.push(resultParameter.data.slice());
      this.selectedChartGroupLabels.push(resultParameter.labels.slice());
    }
  }

  onChangeChartGroup(selectedChart){
    
    for (let index = 0; index < this.selectedDssChartGroup.resultParameters.length; index++) {
    
      this.selectedDssChartGroup.resultParameters[index].data = this.selectedChartGroupData[index];
      this.selectedDssChartGroup.resultParameters[index].labels = this.selectedChartGroupLabels[index];

    }
    
	  this.selectedDssChartGroup = selectedChart;

    this.initDataAndLalbelsArrayOfSelectedGroupChart();

    if(this.areChartFilteredByDate){
      
      let indexes = this.getIndexForDateFiltering();

      let startIndex = indexes[0];
      let endIndex = indexes[1];

      this.filterGroupChartInformationInDateIntervall(startIndex, endIndex);
    }
  }

  openModal(template: TemplateRef<any>, size?: string) {
    this.modalRef = this._modalService.show(template, {class: size, backdrop: false});
    //$(".modal-backdrop.in").css("opacity","0");
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }

  closeModal(){
    let startDateSelector = <HTMLInputElement>document.getElementById("startDate");
    startDateSelector.value = this.startDate;

    let endDateSelector = <HTMLInputElement>document.getElementById("endDate");
    endDateSelector.value = this.endDate;

    this.modalRef.hide();
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

    let indexes = this.getIndexForDateFiltering();

    let startIndex = indexes[0];
    let endIndex = indexes[1];

    let subArrayOfWarningStatusPerDay = this.dssDetail.warningStatusPerDay.slice(startIndex, endIndex + 1);
    let subArrayOfWarningStatusLabels = this.dssDetail.warningStatusLabels.slice(startIndex, endIndex + 1);
    this.warning = this.service.getDssWarningChart(subArrayOfWarningStatusPerDay, subArrayOfWarningStatusLabels);

    this.filterGroupChartInformationInDateIntervall(startIndex, endIndex);

    this.areChartFilteredByDate = true;

  }

  private getIndexForDateFiltering(): number[]{

    let startDateInLabelFormat = moment(this.startDate, this.htmlFormDateFormat).format(this.chartLabelsDateFormat);
    let endDateInLabelFormat = moment(this.endDate, this.htmlFormDateFormat).format(this.chartLabelsDateFormat);

    let startIndex = this.dssDetail.warningStatusLabels.indexOf(startDateInLabelFormat);
    let endIndex = this.dssDetail.warningStatusLabels.indexOf(endDateInLabelFormat);

    return [startIndex, endIndex];

  }

  private filterGroupChartInformationInDateIntervall(startIndex: number, endIndex: number): void{

    let newResultParameters = [];

    for(let resultParameter of this.selectedDssChartGroup.resultParameters){
      newResultParameters.push(resultParameter);
    }
    
    for (let index = 0; index < newResultParameters.length; index++) {

      newResultParameters[index].data = this.selectedChartGroupData[index].slice(startIndex, endIndex + 1);
      newResultParameters[index].labels = this.selectedChartGroupLabels[index].slice(startIndex, endIndex + 1);
      
    }

    this.selectedDssChartGroup.resultParameters = newResultParameters;

  }

  public startDateSelected(event: { target: HTMLInputElement }): void{

    let endDateSelector = <HTMLInputElement>document.getElementById("endDate");
    endDateSelector.value = "0000-00-00";
    this.isEndDateSelected = false;

    this.startDate =  (event.target.value as unknown) as string;
    this.aWeekAhead = moment(this.startDate, this.htmlFormDateFormat).add(7, "days").format(this.htmlFormDateFormat);
    this.isStartDateSelected = true;

  }

  public startDateSelectedInPopup(event: { target: HTMLInputElement }): void{

    let endDateSelector = <HTMLInputElement>document.getElementById("endDatePopup");
    endDateSelector.value = "0000-00-00";
    this.isEndDateSelected = false;

    this.startDate =  (event.target.value as unknown) as string;
    this.aWeekAhead = moment(this.startDate, this.htmlFormDateFormat).add(7, "days").format(this.htmlFormDateFormat);
    this.isStartDateSelected = true;
  
  }
  
  public endDateSelected(event: { target: HTMLInputElement }): void{
    this.endDate =  (event.target.value as unknown) as string;
    this.isEndDateSelected = true;
  }

  public downloadSeasonalData(): void{
    this.service.getDssSeasonalDataAsCsv(this.dssDetail.id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer], {
        type: "text/csv;charset=utf-8"
      });
      saveAs(data, `${this.dssDetail.id}`);
    });
  }
  
}
