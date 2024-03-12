import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Input} from "@angular/core";
import { Subscription } from "rxjs";
import { IDssFlat, DssJSONSchema, IDssResultChart, IDssChartGroup, DssParameters, IDssAdaptationSaveBody } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import { JsonEditorService } from './json-editor/json-editor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery'
import { TranslationService } from '@app/shared/services/translation.service';
import * as moment from 'moment';
import { CustomChartService } from './custom-chart/custom-chart.service';


@Component({
    selector: "app-dss-adaptation-body",
    templateUrl: "./dss-adaptation-body.component.html",
    styleUrls: ["./dss-adaptation-body.component.css"]
})

export class DssAdaptationComponentBody implements OnInit {
    @ViewChild('originalDataset') public originalDataset: ElementRef;
    @ViewChild('revisedDataset') public revisedDataset: ElementRef;
    @ViewChild('originalParameters') public originalParameters: ElementRef;
    @ViewChild('revisedParameters') public revisedParameters: ElementRef;

    @Input() public originalDssDetails!: IDssFlat;
    @Input() public originalDssParameters!: DssJSONSchema;

    public originalWarningChart: { data: number[], labels: string[], chartInformation: IDssResultChart };
    public originalDssChartGroups: IDssChartGroup[] = [];
    public selectedOriginalDssChartGroup: IDssChartGroup;

    public revisedWarningChart: { data: number[], labels: string[], chartInformation: IDssResultChart };
    public revisedDssChartGroups: IDssChartGroup[] = [];
    public selectedRevisedDssChartGroup: IDssChartGroup;
    public revisedDssDetails: IDssFlat;
    public revisedDssParameters: DssJSONSchema;
    public editorForRevisedDSS: any;
    public revisedEditorValid: boolean = false;
    public showRevisedRiskChart: boolean = false;
    public revisedDssStatusTaskId: string;
    public isSyncronizing: boolean = false;
    public chartLabelsDateFormat: string = "DD/MM/YYYY";
    public htmlFormDateFormat: string = "YYYY-MM-DD";
    public startDate: string;
    public endDate: string;
    public minDate: string;
    public maxDate: string;
    public selectedRevisedChartGroupData: number[][];
    public selectedRevisedChartGroupLabels: string[][];
    public selectedOriginalChartGroupData: number[][];
    public selectedOriginalChartGroupLabels: string[][];
    public startDateFormMax: string;
    public twoWeekAhead: string;
    public isStartDateSelected: boolean = false;
    public isEndDateSelected: boolean = false;
    public revisedDataShowed: boolean = true;
    public configurationExecuted: boolean;
    public lastRevisedStartDateSelected: string = "0000-00-00";
    public lastRevisedEndDateSelected: string = "0000-00-00";
    public lastOriginalStartDateSelected: string = "0000-00-00";
    public lastOriginalEndDateSelected: string = "0000-00-00";
    public showingMode: string;
    riskChartZoomLevel: number = 1.0;
    noOriginalGroupChartsAvailable: boolean = false;
    noOriginalRiskChartAvailable: boolean = false;
    noOriginalChartsAvailable: boolean = false;
    noRevisedGroupChartsAvailable: boolean = false;
    noRevisedRiskChartAvailable: boolean = false;
    noRevisedChartsAvailable: boolean = false;
    

    public modalRef: BsModalRef;

    public $subscriptionEditorForRevised: Subscription;
    public $subscriptionSubmit: Subscription;
    public $subscriptionGetRevisedData: Subscription;

    constructor(
        protected _dssSelectionService: DssSelectionService,
        private _logger: NGXLogger,
        private _toastrTranslated: ToastrTranslationService,
        private _jsonEditorService: JsonEditorService,
        private _modalService: BsModalService,
        private _translation: TranslationService,
        private customChartService: CustomChartService
    ) { }

    public ngOnInit(): void {
        
        this._logger.debug("Original DSS Details: ", this.originalDssDetails);
        this._logger.debug("Original DSS Parameters: ", this.originalDssParameters);
        // Chart Define
        this.originalDssChartGroups = this.originalDssDetails.chartGroups;
        this.selectedOriginalDssChartGroup = this.originalDssChartGroups[0];
        this._logger.debug("Original DSS Chart Group: ", this.selectedOriginalDssChartGroup);
        if (this.originalDssDetails.warningStatusPerDay) {
            this.originalWarningChart = this._dssSelectionService.getDssWarningChart(this.originalDssDetails.warningStatusPerDay, this.originalDssDetails.warningStatusLabels);
            this._logger.debug("CHART RISK:", this.originalWarningChart);
        }else{
            this.noOriginalRiskChartAvailable = true;
            this.noRevisedRiskChartAvailable = true;
        }

        // Editor Define
        if (this.editorForRevisedDSS) {
            this._jsonEditorService.reset(this.editorForRevisedDSS);
        }
        if (this.$subscriptionEditorForRevised) {
            this.$subscriptionEditorForRevised.unsubscribe();
        }
        this.revisedDssParameters = this.originalDssParameters;
        this.editorForRevisedDSS = this._jsonEditorService.createJsonEditor('json-editor-form', this.revisedDssParameters);
        this.showingMode = "revised";

        $('#json-editor-form input').css("width","50%");
        $('#json-editor-form label').filter(function () { return $(this).text() === 'root'; }).css("display", "none");
        $('#json-editor-form label').each(function () { $(this).text($(this).text().replace("(YYYY-MM-DD)", "")); });
        
        this.editJsonEditorForm();

        this.$subscriptionEditorForRevised = this._jsonEditorService.listenChanges(this.editorForRevisedDSS).subscribe(() => this.revisedEditorChanges());

        // For the first time i get the Data, assign the original data to the revised variables
        this.revisedDssChartGroups = this.originalDssChartGroups;
        this.selectedRevisedDssChartGroup = this.selectedOriginalDssChartGroup; 
        this.revisedWarningChart = this.originalWarningChart;
        this.showRevisedRiskChart = true;
        this.revisedDssDetails = this.originalDssDetails;
        this.revisedDssParameters = this.originalDssParameters;

        this.configurationExecuted = false;
        
        this.ChartGroupDataSanityCheck("revised");
        this.ChartGroupDataSanityCheck("original");

        if(this.noRevisedGroupChartsAvailable && this.noRevisedRiskChartAvailable){
            this.noRevisedChartsAvailable = true;
            this.noOriginalChartsAvailable = true;
        }else{
            this.initDatePicker("revised");
            this.initDataAndLalbelsArrayOfSelectedGroupChart("revised");
            this.initDataAndLalbelsArrayOfSelectedGroupChart("original");
        }
    }

    private initDatePicker(mode: string){

        if(mode == "revised"){

            this.minDate = moment(this.revisedDssDetails.warningStatusLabels[0], this.chartLabelsDateFormat)
            .format(this.htmlFormDateFormat);

            this.maxDate = moment(this.revisedDssDetails.warningStatusLabels[this.revisedDssDetails.warningStatusLabels.length-1], this.chartLabelsDateFormat)
            .format(this.htmlFormDateFormat);

            this.startDateFormMax = moment(this.revisedDssDetails.warningStatusLabels[this.revisedDssDetails.warningStatusLabels.length-1], this.chartLabelsDateFormat)
            .subtract(14, "days").format(this.htmlFormDateFormat);

        }else{

            this.minDate = moment(this.originalDssDetails.warningStatusLabels[0], this.chartLabelsDateFormat)
            .format(this.htmlFormDateFormat);

            this.maxDate = moment(this.originalDssDetails.warningStatusLabels[this.originalDssDetails.warningStatusLabels.length-1], this.chartLabelsDateFormat)
            .format(this.htmlFormDateFormat);

            this.startDateFormMax = moment(this.originalDssDetails.warningStatusLabels[this.originalDssDetails.warningStatusLabels.length-1], this.chartLabelsDateFormat)
            .subtract(14, "days").format(this.htmlFormDateFormat);

        }
    }

    private refreshDatePicker(mode: string){

        let startDateSelector = <HTMLInputElement>document.getElementById("startDate");
        let endDateSelector = <HTMLInputElement>document.getElementById("endDate");

        if( mode == "revised"){

            startDateSelector.value = this.lastRevisedStartDateSelected;
            endDateSelector.value = this.lastRevisedEndDateSelected;

        }else if( mode == "original"){

            startDateSelector.value = this.lastOriginalStartDateSelected;
            endDateSelector.value = this.lastOriginalEndDateSelected;

        }else{

            startDateSelector.value = "0000-00-00";
            endDateSelector.value = "0000-00-00";
        }

        if(startDateSelector.value != "0000-00-00" &&  startDateSelector.value != ""){
            this.isStartDateSelected = true;
            this.startDate = startDateSelector.value;
            this.twoWeekAhead = moment(this.startDate, this.htmlFormDateFormat).add(14, "days").format(this.htmlFormDateFormat);

            if(endDateSelector.value != "0000-00-00" && endDateSelector.value != ""){
                this.isEndDateSelected = true;
                this.endDate = endDateSelector.value;
                
            }else{
                this.isEndDateSelected = false;
            }

        }else{
            this.isStartDateSelected = false;
            endDateSelector.value = "0000-00-00";
            this.isEndDateSelected = false;
        }


    }

    private initDataAndLalbelsArrayOfSelectedGroupChart(mode: string): void{

        if(mode == "revised"){

            this.selectedRevisedChartGroupData = [];
            this.selectedRevisedChartGroupLabels = [];

            if(!this.noRevisedGroupChartsAvailable){
                for(let resultParameter of this.selectedRevisedDssChartGroup.resultParameters){
                    this.selectedRevisedChartGroupData.push(resultParameter.data.slice());
                    this.selectedRevisedChartGroupLabels.push(resultParameter.labels.slice());
                }
            }
        }else{

            this.selectedOriginalChartGroupData = [];
            this.selectedOriginalChartGroupLabels = [];

            if(!this.noOriginalGroupChartsAvailable){
                for(let resultParameter of this.selectedOriginalDssChartGroup.resultParameters){
                    this.selectedOriginalChartGroupData.push(resultParameter.data.slice());
                    this.selectedOriginalChartGroupLabels.push(resultParameter.labels.slice());
                }
            }    
        }
        
    }

    editJsonEditorForm(){
        
        let labelTag;
        let dssParams = this._jsonEditorService.getValues(this.editorForRevisedDSS);
        for(var key in dssParams){
            for(var subkey in dssParams[key]){
                let value = (dssParams[key][subkey] != "") ? dssParams[key][subkey] : this._translation.getTranslatedMessage("DSS_adaptation.Not_defined");
                labelTag = $("<label>").attr('for', `root\[${key}\]\[${subkey}\]`).text(`${this._translation.getTranslatedMessage("DSS_adaptation.Default")}: ${value}`).css({"font-weight": "bold"});
                $(`input[name=root\\[${key}\\]\\[${subkey}\\]`).after(labelTag);
            }
        }
    }

    public onChangeChartGroup(selectedChart) {
        this._logger.debug("SELECTED CHART", selectedChart);
        this._logger.debug("ACTUAL ORIGINAL SEL CHART", this.selectedOriginalDssChartGroup);
        this._logger.debug("ACTUAL REVISED SEL CHART", this.selectedRevisedDssChartGroup);
        this.selectedOriginalDssChartGroup = selectedChart
        this.selectedRevisedDssChartGroup = selectedChart
    }

    public revisedEditorChanges(): void {
        if (this.editorForRevisedDSS) {
            this.revisedEditorValid = this._jsonEditorService.isValid(this.editorForRevisedDSS);
        }
    }

    private resetChartZoom(popUp: boolean, chartType: string): void{

        let riskChart;
        let groupChart;
        
        if(!popUp){
            if(this.revisedDataShowed){
                riskChart = this.customChartService.getChart('adaptationChartRevised-'+this.revisedDssDetails.id);
                if(!this.noRevisedGroupChartsAvailable){
                    groupChart = this.customChartService.getChart('adaptationGroupChartRevised-'+this.selectedRevisedDssChartGroup.id);    
                }
            }else{
                riskChart = this.customChartService.getChart('adaptationChartOriginal-'+this.originalDssDetails.id);
                if(!this.noOriginalGroupChartsAvailable){
                    groupChart = this.customChartService.getChart('adaptationGroupChartOriginal-'+this.selectedOriginalDssChartGroup.id);                
                }
            }
        }else{
            if(this.revisedDataShowed){
                riskChart = this.customChartService.getChart('detailChartPopupRevised-'+this.revisedDssDetails.id);
                if(!this.noRevisedGroupChartsAvailable){
                    groupChart = this.customChartService.getChart('detailChartPopupRevised-'+this.selectedRevisedDssChartGroup.id);                
                }
            }else{
                riskChart = this.customChartService.getChart('detailChartPopupOriginal-'+this.originalDssDetails.id );
                if(!this.noOriginalGroupChartsAvailable){
                    groupChart = this.customChartService.getChart('detailChartPopupOriginal-'+this.selectedOriginalDssChartGroup.id);                
                }
            }
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

    public openModal(template: TemplateRef<any>, size?: string, chartType: string= 'none') {
       
        this.resetChartZoom(false, chartType);
        
        this.modalRef = this._modalService.show(template, { class: size, backdrop: "static" });
    }

    public updateScrollDataset(): void {
        const originalDataset = this.originalDataset.nativeElement as HTMLElement;
        const revisedDataset = this.revisedDataset.nativeElement as HTMLElement;

        if (originalDataset.matches(':hover')) {
            revisedDataset.scrollTop = originalDataset.scrollTop;
            revisedDataset.scrollLeft = originalDataset.scrollLeft;
        } else if (revisedDataset.matches(':hover')) {
            originalDataset.scrollTop = revisedDataset.scrollTop;
            originalDataset.scrollLeft = revisedDataset.scrollLeft;
        }
    }

    public updateScrollParameters(): void {
        const originalParameters = this.originalParameters.nativeElement as HTMLElement;
        const revisedParameters = this.revisedParameters.nativeElement as HTMLElement;

        if (originalParameters.matches(':hover')) {
            revisedParameters.scrollTop = originalParameters.scrollTop;
            revisedParameters.scrollLeft = originalParameters.scrollLeft;
        } else if (revisedParameters.matches(':hover')) {
            originalParameters.scrollTop = revisedParameters.scrollTop;
            originalParameters.scrollLeft = revisedParameters.scrollLeft;
        }
    }

    public onSubmitRevisedParameters(): void {

        if (this.editorForRevisedDSS && this.revisedEditorValid) {
            let inputParams: DssParameters = new DssParameters(JSON.stringify(this._jsonEditorService.getValues(this.editorForRevisedDSS)));
            this.$subscriptionSubmit = this._dssSelectionService.sendDssParametersForAdaptation(this.revisedDssDetails.id, inputParams).subscribe(
                (data: HttpResponse<any>) => {
                    if (data) {
                        this.revisedDssStatusTaskId = data.body.id;
                        this._logger.debug("DSS Status Task ID:", this.revisedDssStatusTaskId);
                        this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_adaptation_parameters_sent", "Common_labels.Success", "toast-success");
                        this.reloadData(0);
                    }
                },
                (error: HttpErrorResponse) => {
                    this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_adaptation_parameters_send_error", "Common_labels.Error", "toast-error");
                    this._logger.error("DSS Adaptation, Operation Failed:", error);
                }
            )
        }
        //this.editJsonEditorForm();
    }

    public checkStatusOfDSS(): void {
        this.showRevisedRiskChart = false;
        this.$subscriptionGetRevisedData = this._dssSelectionService.getDssAdaptationRevisedData(this.revisedDssDetails.id, this.revisedDssStatusTaskId).subscribe(
            (data: HttpResponse<any>) => {
                if (data.body.dssDetailedResult) {
                    if (data.body.dssTaskStatusDto.jobStatus === "Succeeded") {
                        this._logger.debug("Revised Data received: ", data.body.dssDetailedResult);
                        this.revisedDssDetails = data.body.dssDetailedResult;
                        this.revisedDssChartGroups = this.revisedDssDetails.chartGroups;
                        if(this.revisedDssDetails.warningStatusPerDay){
                            this.revisedWarningChart = this._dssSelectionService.getDssWarningChart(this.revisedDssDetails.warningStatusPerDay, this.revisedDssDetails.warningStatusLabels);
                            this.noRevisedRiskChartAvailable = false;
                        }else{
                            this.noRevisedRiskChartAvailable = true;
                        }
                        this.selectedRevisedDssChartGroup = this.revisedDssChartGroups[0];
                        this.ChartGroupDataSanityCheck("revised");
                        if(this.noRevisedGroupChartsAvailable && this.noRevisedRiskChartAvailable){
                            this.noRevisedChartsAvailable = true;
                        }else{
                            this.noRevisedChartsAvailable = false;
                            
                        }
                        this.showRevisedRiskChart = true;
                        this.initDataAndLalbelsArrayOfSelectedGroupChart("revised");
                        this.isSyncronizing = false;
                        this.configurationExecuted = true;
                        if(!this.noRevisedRiskChartAvailable){
                            this.initDatePicker("revised");
                            this.refreshDatePicker("none");
                        }
                        this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_adaptation_parameters_updated", "Common_labels.Success", "toast-success");
                    } else {
                        this._logger.debug("DSS Data not Ready: ", data.body.dssDetailedResult);
                        this.reloadData(5);
                    }
                }

            },
            (error: HttpErrorResponse) => {
                this._logger.error("Dss adaptation error", error);
                this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_adaptation_parameters_update_error", "Common_labels.Error", "toast-error");
            }
        );
    }

    private reloadData(counter: number): void {
        this._logger.info("Reloading!");
        this.isSyncronizing = true;
        let intervalId = setInterval(() => {
            counter = counter - 1;
            if (counter < 1) {
                clearInterval(intervalId);
                this.checkStatusOfDSS();
            }
        }, 1000)
    }

    saveParametrization(): void{
        let dssParameters = JSON.stringify(this._jsonEditorService.getValues(this.editorForRevisedDSS));
        let inputTextBox = <HTMLInputElement>document.getElementById("dss_name");
        let dssName = <string>inputTextBox.value;
        let dssToSave: IDssAdaptationSaveBody = {
            name: dssName,
            dssParameters: dssParameters
        };
        this._dssSelectionService.saveAdaptedDss(this.revisedDssDetails.id, dssToSave).subscribe(
            (data: HttpResponse<any>) => {
                this._toastrTranslated.showTranslatedToastr("Information_messages.Parameters_saved", "Common_labels.Success", "toast-success");
            },
            (error: HttpErrorResponse) => {
                this._toastrTranslated.showTranslatedToastr("Error_messages.Parameters_not_saved", "Common_labels.Error", "toast-error");
            }
        );
    }

    public startDateSelected(event: { target: HTMLInputElement }): void{

        let endDateSelector = <HTMLInputElement>document.getElementById("endDate");
        endDateSelector.value = "0000-00-00";
        this.isEndDateSelected = false;

        if(this.revisedDataShowed){
            this.lastRevisedEndDateSelected = endDateSelector.value;
        }else{
            this.lastOriginalEndDateSelected = endDateSelector.value;
        }

        this.startDate =  (event.target.value as unknown) as string;

        if(this.revisedDataShowed){
            this.lastRevisedStartDateSelected = this.startDate;
        }else{
            this.lastOriginalStartDateSelected = this.startDate;
        }

        this.twoWeekAhead = moment(this.startDate, this.htmlFormDateFormat).add(14, "days").format(this.htmlFormDateFormat);
        this.isStartDateSelected = true;
    
    }

    public startDateSelectedInPopup(event: { target: HTMLInputElement }): void{

        let endDateSelector = <HTMLInputElement>document.getElementById("endDatePopup");
        endDateSelector.value = "0000-00-00";
        this.isEndDateSelected = false;

        if(this.revisedDataShowed){
            this.lastRevisedEndDateSelected = endDateSelector.value;
        }else{
            this.lastOriginalEndDateSelected = endDateSelector.value;
        }

        this.startDate =  (event.target.value as unknown) as string;

        if(this.revisedDataShowed){
            this.lastRevisedStartDateSelected = this.startDate;
        }else{
            this.lastOriginalStartDateSelected = this.startDate;
        }
        
        this.twoWeekAhead = moment(this.startDate, this.htmlFormDateFormat).add(14, "days").format(this.htmlFormDateFormat);
        this.isStartDateSelected = true;
    
    }
    
    public endDateSelected(event: { target: HTMLInputElement }): void{
        this.endDate =  (event.target.value as unknown) as string;
        this.isEndDateSelected = true;
        if(this.revisedDataShowed){
            this.lastRevisedEndDateSelected = this.endDate;
        }else{
            this.lastOriginalEndDateSelected = this.endDate;
        }
    }

    public onConfirmDays(mode: string): void {

        let indexes = this.getIndexForDateFiltering(mode);
    
        let startIndex = indexes[0];
        let endIndex = indexes[1];

        let subArrayOfWarningStatusPerDay: number[];
        let subArrayOfWarningStatusLabels: string[];

        if( mode == "revised"){
            subArrayOfWarningStatusPerDay = this.revisedDssDetails.warningStatusPerDay.slice(startIndex, endIndex + 1);
            subArrayOfWarningStatusLabels = this.revisedDssDetails.warningStatusLabels.slice(startIndex, endIndex + 1);
            
            this.revisedWarningChart = this._dssSelectionService.getDssWarningChart(subArrayOfWarningStatusPerDay, subArrayOfWarningStatusLabels);
        }else{
            subArrayOfWarningStatusPerDay = this.originalDssDetails.warningStatusPerDay.slice(startIndex, endIndex + 1);
            subArrayOfWarningStatusLabels = this.originalDssDetails.warningStatusLabels.slice(startIndex, endIndex + 1);

            
            this.originalWarningChart = this._dssSelectionService.getDssWarningChart(subArrayOfWarningStatusPerDay, subArrayOfWarningStatusLabels);
        }
    
        this.filterGroupChartInformationInDateIntervall(startIndex, endIndex, mode);
    
        
    
    }

    private getIndexForDateFiltering(mode: string): number[]{

        let startDateInLabelFormat = moment(this.startDate, this.htmlFormDateFormat).format(this.chartLabelsDateFormat);
        let endDateInLabelFormat = moment(this.endDate, this.htmlFormDateFormat).format(this.chartLabelsDateFormat);

        let startIndex: number;
        let endIndex: number;

        if( mode == "revised"){
            startIndex = this.revisedDssDetails.warningStatusLabels.indexOf(startDateInLabelFormat);
            endIndex = this.revisedDssDetails.warningStatusLabels.indexOf(endDateInLabelFormat);
        }else{
            startIndex = this.originalDssDetails.warningStatusLabels.indexOf(startDateInLabelFormat);
            endIndex = this.originalDssDetails.warningStatusLabels.indexOf(endDateInLabelFormat);
        }
    
        
    
        return [startIndex, endIndex];
    
    }

    private filterGroupChartInformationInDateIntervall(startIndex: number, endIndex: number, mode: string): void{

        let newResultParameters = [];

        if( mode == "revised" && !this.noRevisedGroupChartsAvailable){

            for(let resultParameter of this.selectedRevisedDssChartGroup.resultParameters){
                newResultParameters.push(resultParameter);
            }
            
            for (let index = 0; index < newResultParameters.length; index++) {
            
                newResultParameters[index].data = this.selectedRevisedChartGroupData[index].slice(startIndex, endIndex + 1);
                newResultParameters[index].labels = this.selectedRevisedChartGroupLabels[index].slice(startIndex, endIndex + 1);
            
            }
          
            this.selectedRevisedDssChartGroup.resultParameters = newResultParameters;

        }else if(mode == "original" && !this.noOriginalGroupChartsAvailable){
            for(let resultParameter of this.selectedOriginalDssChartGroup.resultParameters){
                newResultParameters.push(resultParameter);
            }
            
            for (let index = 0; index < newResultParameters.length; index++) {
            
                newResultParameters[index].data = this.selectedOriginalChartGroupData[index].slice(startIndex, endIndex + 1);
                newResultParameters[index].labels = this.selectedOriginalChartGroupLabels[index].slice(startIndex, endIndex + 1);
            
            }
          
            this.selectedOriginalDssChartGroup.resultParameters = newResultParameters;
        }
    
        
    
    }

    closeModal(chartType: string){

        this.resetChartZoom(true, chartType);
        
        let startDateSelector = <HTMLInputElement>document.getElementById("startDate");
        startDateSelector.value = this.startDate;
    
        let endDateSelector = <HTMLInputElement>document.getElementById("endDate");
        endDateSelector.value = this.endDate;
    
        this.modalRef.hide();
    }

    showOriginalData(){
        this.resetChartZoom(false, "risk");
        this.resetChartZoom(false, "group");
        this.revisedDataShowed = false;
        this.initDatePicker("original");     
        this.showingMode = "original";
        this.refreshDatePicker("original");
        $('#revisedDataButton').css({"background-color":"#3f6ad8", "border-color":"#3f6ad8"});
        $('#originalDataButton').css({"background-color":"orange", "border-color":"orange"});
    }

    showRevisedData(){
        this.resetChartZoom(false, "risk");
        this.resetChartZoom(false, "group");
        this.revisedDataShowed = true;
        this.initDatePicker("revised");
        this.showingMode = "revised";
        this.refreshDatePicker("revised");
        $('#revisedDataButton').css({"background-color":"orange", "border-color":"orange"});
        $('#originalDataButton').css({"background-color":"#3f6ad8", "border-color":"#3f6ad8"});
    }

    ChartGroupDataSanityCheck(mode: string){
        if(mode === "revised"){
            if(this.revisedDssChartGroups.length === 0){
                this.noRevisedGroupChartsAvailable = true;
                return;
            }
            for(let chartGroups of this.revisedDssChartGroups){
                if(chartGroups.id === ''){
                  this.noRevisedGroupChartsAvailable = true;
                  break;
                }
            }
        }else{
            if(this.originalDssChartGroups.length === 0){
                this.noOriginalGroupChartsAvailable = true;
                return;
            }
            for(let chartGroups of this.originalDssChartGroups){
                if(chartGroups.id === ''){
                  this.noOriginalGroupChartsAvailable = true;
                  break;
                }
            }
        }
    }
}