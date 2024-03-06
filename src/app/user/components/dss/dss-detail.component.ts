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
import { CustomChartService } from './custom-chart/custom-chart.service';

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
  chartLabelsDateFormat: string = "DD/MM/YYYY";
  htmlFormDateFormat: string = "YYYY-MM-DD";
  startDate: string;
  endDate: string;
  minDate: string;
  maxDate: string;
  selectedChartGroupData: number[][];
  selectedChartGroupLabels: string[][];
  startDateFormMax: string;
  twoWeekAhead: string;
  isStartDateSelected: boolean = false;
  isEndDateSelected: boolean = false;
  areChartsFilteredByDate: boolean = false;
  invalidFileName: boolean = false;
  seasonalDataPlaceholder: string = "IPMDecisions_Download";
  noGroupChartsAvailable: boolean = false;
  noRiskChartAvailable: boolean = false;
  noChartsAvailable: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private _modalService: BsModalService,
    private service: DssSelectionService,
    private _router: Router,
	  private _logger: NGXLogger,
    private _toastrTranslated: ToastrTranslationService,
    private customChartService: CustomChartService
	) { }
  
  ngOnInit() {
    this.$subscription = this.activatedRoute.data.subscribe(({ dssDetail }) => {
      this.dssDetail = dssDetail;
      this.status = this.dssDetail.warningStatus;
		  this.dssChartGroups = this.dssDetail.chartGroups;
	    this.selectedDssChartGroup = this.dssChartGroups[0];
      this.ChartGroupDataSanityCheck();
      if(this.dssDetail.warningStatusPerDay){
		    /*let labels = [];
        for(let i=0; i<this.dssDetail.warningStatusPerDay.length; i++){
          labels.push(this.dssDetail.outputTimeStart);
        }*/
		    this.warning = this.service.getDssWarningChart(this.dssDetail.warningStatusPerDay, this.dssDetail.warningStatusLabels);
	    }else{
        this.noRiskChartAvailable = true;
      }
      if(this.noRiskChartAvailable && this.noGroupChartsAvailable){
        this.noChartsAvailable = true;
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
    .subtract(14, "days").format(this.htmlFormDateFormat);

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

    if(this.areChartsFilteredByDate){
      
      let indexes = this.getIndexForDateFiltering();

      let startIndex = indexes[0];
      let endIndex = indexes[1];

      this.filterGroupChartInformationInDateIntervall(startIndex, endIndex);
    }
  }

  private resetChartZoom(popUp: boolean, chartType: string): void{

    let riskChart;
    let groupChart;
    
    if(!popUp){
      riskChart = this.customChartService.getChart('detailChart-'+this.dssDetail.id);
      groupChart = this.customChartService.getChart('detailChart-'+this.selectedDssChartGroup.id);
    }else{
      riskChart = this.customChartService.getChart('detailChartPopup-'+this.dssDetail.id);
      groupChart = this.customChartService.getChart('detailChartPopup-'+this.selectedDssChartGroup.id);
    }

    if(chartType == "risk"){
      if (riskChart && riskChart.isZoomedOrPanned()) {
        riskChart.resetZoom('active');
      }
    }else if(chartType == "group"){
      if (groupChart && groupChart.isZoomedOrPanned()) {
        groupChart.resetZoom('active');
      }
    }
    
  }

  openInfoModal(template: TemplateRef<any>, size?: string) {
    this.modalRef = this._modalService.show(template, {class: size, backdrop: false});
    //$(".modal-backdrop.in").css("opacity","0");
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0';
  }

  openModal(template: TemplateRef<any>, size?: string, chartType: string = 'none') {
 
    this.resetChartZoom(false, chartType);

    this.modalRef = this._modalService.show(template, {class: size, backdrop: "static"});
    //$(".modal-backdrop.in").css("opacity","0");
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0'; 
    this.invalidFileName = false;
  }

  closeModal(chartType: string){

    this.resetChartZoom(true, chartType);

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

  public onConfirmDays(): void {

    let indexes = this.getIndexForDateFiltering();

    let startIndex = indexes[0];
    let endIndex = indexes[1];

    let subArrayOfWarningStatusPerDay = this.dssDetail.warningStatusPerDay.slice(startIndex, endIndex + 1);
    let subArrayOfWarningStatusLabels = this.dssDetail.warningStatusLabels.slice(startIndex, endIndex + 1);
    this.warning = this.service.getDssWarningChart(subArrayOfWarningStatusPerDay, subArrayOfWarningStatusLabels);

    this.filterGroupChartInformationInDateIntervall(startIndex, endIndex);

    this.areChartsFilteredByDate = true;

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
    this.twoWeekAhead = moment(this.startDate, this.htmlFormDateFormat).add(14, "days").format(this.htmlFormDateFormat);
    this.isStartDateSelected = true;

  }

  public startDateSelectedInPopup(event: { target: HTMLInputElement }): void{

    let endDateSelector = <HTMLInputElement>document.getElementById("endDatePopup");
    endDateSelector.value = "0000-00-00";
    this.isEndDateSelected = false;

    this.startDate =  (event.target.value as unknown) as string;
    this.twoWeekAhead = moment(this.startDate, this.htmlFormDateFormat).add(14, "days").format(this.htmlFormDateFormat);
    this.isStartDateSelected = true;
  
  }
  
  public endDateSelected(event: { target: HTMLInputElement }): void{
    this.endDate =  (event.target.value as unknown) as string;
    this.isEndDateSelected = true;
  }

  public downloadSeasonalData(): void{
    let inputTextBox = <HTMLInputElement>document.getElementById("file_name");
    let fileName = <string>inputTextBox.value;
    
    if(this.isFileNameInvalid(fileName)){
      this.invalidFileName = true;
      return;
    }
    this.invalidFileName = false;
    this.service.getDssSeasonalDataAsCsv(this.dssDetail.id).subscribe((buffer) => {
      const data: Blob = new Blob([buffer], {
        type: "text/csv;charset=utf-8"
      });
      saveAs(data, `${fileName}`);
      this._toastrTranslated.showTranslatedToastr("Information_messages.Seasonal_data_download_success","Common_labels.Success","toast-success")
    },()=>{
      this._toastrTranslated.showTranslatedToastr("Error_messages.Seasonal_data_download_error","Common_labels.Error","toast-error");
    });
    
    this.modalRef.hide();
  }


  isFileNameInvalid(fileName: string): boolean {
    return fileName.length <= 0;
  }

  ChartGroupDataSanityCheck(){
    for(let chartGroups of this.dssChartGroups){
      if(chartGroups.id === ''){
        this.noGroupChartsAvailable = true;
        break;
      }
    }
  }
  
}
