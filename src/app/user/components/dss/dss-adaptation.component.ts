import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IDssFlat, IDssForAdaptation, DssJSONSchema } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
    selector: "app-dss-adaptation",
    templateUrl: "./dss-adaptation.component.html",
    styleUrls: ["./dss-adaptation.component.css"]
})

export class DssAdaptationComponent implements OnInit, OnDestroy {

    public remoteCallLoading: boolean = false;
    public dssList: IDssFlat[] = [];
    public dssToAdapt: IDssFlat;
    public modelIsSelected: boolean = false;
    public showAdaptationDSS: boolean = false;
    public selectedModel: string;
    public haveModelToAdapt: boolean = false;

    public originalDssDetails: IDssFlat;
    public originalDssParameters: DssJSONSchema;

    public $startSubscription: Subscription;
    public $getDssToAdaptSubscription: Subscription;

    constructor(
        protected _dssSelectionService: DssSelectionService,
        private _logger: NGXLogger,
        private _toastrTranslated: ToastrTranslationService,
    ) { }

    public ngOnInit(): void {
        this.remoteCallLoading = true;
        this.$startSubscription = this._dssSelectionService.getDssList().subscribe((data: HttpResponse<IDssFlat[]>) => {
            this._logger.debug("DSS LIST: ", data.body)
            data.body.forEach(element => {
                this._logger.debug("DSS: ", element.dssModelName);
                this._logger.debug("DSS IS VALID?: ", element.isValid);
                if (element.isValid) {
                    this._logger.debug("DSS VALID!");
                    this.dssList.push(element);
                }
            });
            this.remoteCallLoading = false;
            if (this.dssList.length > 0) {
                this.showAdaptationDSS = true;
            }
            this._logger.debug("DSS LIST: ", this.dssList)
        });
    }

    public ngOnDestroy(): void {
        if (this.$startSubscription) {
            this.$startSubscription.unsubscribe();
        }
    }

    public modelSelectChanged(event: { target: HTMLInputElement }) {
        this.selectedModel = event.target.value;
    }

    public onConfirmModel(): void {
        this.haveModelToAdapt = false;
        if (this.$startSubscription) {
            this.$startSubscription.unsubscribe();
        }
        this.$getDssToAdaptSubscription = this._dssSelectionService.getDssToAdapt(this.selectedModel).subscribe(
            (data: HttpResponse<IDssForAdaptation>) => {
                this._logger.debug("DSS TO ADAPT: ", data.body);
                this.originalDssDetails = data.body.dssOriginalResult;
                this.originalDssParameters = data.body.dssOriginalParameters;
                if (this.originalDssDetails && this.originalDssParameters) {
                    this.haveModelToAdapt = true;
                    this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_adaptation_model_retrived", "Common_labels.Success", "toast-success");
                } else {
                    this.haveModelToAdapt = false;
                    this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_adaptation_model_retrived_error", "Common_labels.Error", "toast-error");
                }
            },
            (error: HttpErrorResponse) => {
                this._logger.error("Dss adaptation error", error);
                this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_adaptation_model_retrived_error", "Common_labels.Error", "toast-error");
            }
        );
    }
}