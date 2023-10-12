import { Component, Input, OnInit, TemplateRef} from '@angular/core';
import { IDssFlat, IDssChartGroup, IDssResultChart } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

@Component({
    selector: 'app-dss-comparison-row',
    templateUrl: './dss-comparison-row.component.html',
    styleUrls: ['./dss-comparison-row.component.css'],
  })
export class DssComparisonRowComponent implements OnInit {

    @Input() public dssDetail!: IDssFlat;
    @Input() public comparisonMode!: string;

    warning: {data:number[],labels:string[],chartInformation:IDssResultChart};
    dssChartGroups: IDssChartGroup[] = [];
    selectedDssChartGroup: IDssChartGroup;
    modalRef: BsModalRef;
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

    constructor(
        private service: DssSelectionService,
        private _logger: NGXLogger,
        private _toastrTranslated: ToastrTranslationService,
        private _modalService: BsModalService,
    ) { }

    ngOnInit(): void {
        this.dssChartGroups = this.dssDetail.chartGroups;
	    this.selectedDssChartGroup = this.dssChartGroups[0];
        if(this.dssDetail.warningStatusPerDay){
		    this.warning = this.service.getDssWarningChart(this.dssDetail.warningStatusPerDay, this.dssDetail.warningStatusLabels);
	    }
        this.minDate = moment(this.dssDetail.warningStatusLabels[0], this.chartLabelsDateFormat)
        .format(this.htmlFormDateFormat);

        this.maxDate = moment(this.dssDetail.warningStatusLabels[this.dssDetail.warningStatusLabels.length-1], this.chartLabelsDateFormat)
        .format(this.htmlFormDateFormat);

        this.startDateFormMax = moment(this.dssDetail.warningStatusLabels[this.dssDetail.warningStatusLabels.length-1], this.chartLabelsDateFormat)
        .subtract(14, "days").format(this.htmlFormDateFormat);

        this.initDataAndLalbelsArrayOfSelectedGroupChart();
    }

    private initDataAndLalbelsArrayOfSelectedGroupChart(): void{

      this.selectedChartGroupData = [];
      this.selectedChartGroupLabels = [];
      for(let resultParameter of this.selectedDssChartGroup.resultParameters){
        this.selectedChartGroupData.push(resultParameter.data.slice());
        this.selectedChartGroupLabels.push(resultParameter.labels.slice());
      }
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

      let endDateSelector = <HTMLInputElement>document.getElementById("endDate" + this.dssDetail.id + this.comparisonMode);
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

    openModal(template: TemplateRef<any>, size?: string) {
        this.modalRef = this._modalService.show(template, {class: size});
    }

    closeModal(){
        let startDateSelector = <HTMLInputElement>document.getElementById("startDate" + this.dssDetail.id + this.comparisonMode);
        startDateSelector.value = this.startDate;
    
        let endDateSelector = <HTMLInputElement>document.getElementById("endDate" + this.dssDetail.id + this.comparisonMode);
        endDateSelector.value = this.endDate;
    
        this.modalRef.hide();
      }

}