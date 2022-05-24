import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { IDssFlat, DssJSONSchema, IDssResultChart, IDssChartGroup, DssParameters } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import { JsonEditorService } from './json-editor/json-editor.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery'

@Component({
    selector: "app-dss-adaptation-body",
    templateUrl: "./dss-adaptation-body.component.html",
    styleUrls: ["./dss-adaptation-body.component.css"]
})

export class DssAdaptationComponentBody implements OnInit {
    @ViewChild('originalDataset', { static: false }) public originalDataset: ElementRef;
    @ViewChild('revisedDataset', { static: false }) public revisedDataset: ElementRef;
    @ViewChild('originalParameters', { static: false }) public originalParameters: ElementRef;
    @ViewChild('revisedParameters', { static: false }) public revisedParameters: ElementRef;

    @Input() public originalDssDetails!: IDssFlat;
    @Input() public originalDssParameters!: DssJSONSchema;

    public editorForOriginalDSS: any;
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

    public modalRef: BsModalRef;

    public $subscriptionEditorForRevised: Subscription;
    public $subscriptionSubmit: Subscription;
    public $subscriptionGetRevisedData: Subscription;

    constructor(
        protected _dssSelectionService: DssSelectionService,
        private _logger: NGXLogger,
        private _toastrTranslated: ToastrTranslationService,
        private _jsonEditorService: JsonEditorService,
        private _modalService: BsModalService
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
        }

        // Editor Define
        if (this.editorForOriginalDSS) {
            this._jsonEditorService.reset(this.editorForOriginalDSS);
        }
        if (this.editorForRevisedDSS) {
            this._jsonEditorService.reset(this.editorForRevisedDSS);
        }
        if (this.$subscriptionEditorForRevised) {
            this.$subscriptionEditorForRevised.unsubscribe();
        }
        this.editorForOriginalDSS = this._jsonEditorService.createJsonEditor('json-editor-form-original', this.originalDssParameters);
        this.revisedDssParameters = this.originalDssParameters;
        this.editorForRevisedDSS = this._jsonEditorService.createJsonEditor('json-editor-form-revised', this.revisedDssParameters);
        $('#json-editor-form-original label').filter(function () { return $(this).text() === 'root'; }).css("display", "none");
        $('#json-editor-form-revised label').filter(function () { return $(this).text() === 'root'; }).css("display", "none");
        $('#json-editor-form-original input').each(function () { $(this).attr('disabled', 'disabled'); });
        $('#json-editor-form-revised label').each(function () { $(this).text($(this).text().replace("(YYYY-MM-DD)", "")); });
        $('#json-editor-form-original label').each(function () { $(this).text($(this).text().replace("(YYYY-MM-DD)", "")); });

        this.$subscriptionEditorForRevised = this._jsonEditorService.listenChanges(this.editorForRevisedDSS).subscribe(() => this.revisedEditorChanges());

        // For the first time i get the Data, assign the original data to the revised variables
        this.revisedDssChartGroups = this.originalDssChartGroups;
        this.selectedRevisedDssChartGroup = this.selectedOriginalDssChartGroup;
        this.revisedWarningChart = this.originalWarningChart;
        this.showRevisedRiskChart = true;
        this.revisedDssDetails = this.originalDssDetails;
        this.revisedDssParameters = this.originalDssParameters;
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

    public openModal(template: TemplateRef<any>, size?: string) {
        this.modalRef = this._modalService.show(template, { class: size });
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
            let inputParams: DssParameters = new DssParameters(JSON.stringify(this._jsonEditorService.getValues(this.editorForRevisedDSS)))
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
                        this.revisedWarningChart = this._dssSelectionService.getDssWarningChart(this.revisedDssDetails.warningStatusPerDay, this.revisedDssDetails.warningStatusLabels);
                        this.selectedRevisedDssChartGroup = this.selectedOriginalDssChartGroup;
                        this.showRevisedRiskChart = true;
                        this.isSyncronizing = false;
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
}