import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IDssFlat } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from "ngx-logger";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import * as $ from 'jquery';

@Component({
    selector: "app-dss-comparison",
    templateUrl: "./dss-comparison.component.html",
    styleUrls: ["./dss-comparison.component.css"]
})
export class DssComparisonComponent implements OnInit, OnDestroy {

    public remoteCallLoading: boolean = false;
    public $startSubscription: Subscription;
    public dssList: IDssFlat[] = [];
    public modelSelectionForm: FormGroup;
    public dssInComparison: IDssFlat[];
    public areModelsSelected: boolean = false;
    public showComparisonDSS: boolean = false;
    public maxSelections: number = 5;
    public numberOfModelSelected: number = 0;
    public selectedModelsId: string[] = [];

    constructor(
        protected _dssSelectionService: DssSelectionService,
        private _logger: NGXLogger,
        private _fb: FormBuilder,
        private _toastrTranslated: ToastrTranslationService
    ) { }

    ngOnInit() {
        this.formInit();
        this.remoteCallLoading = true;
        this.$startSubscription = this._dssSelectionService.getDssList().subscribe((data: HttpResponse<IDssFlat[]>)=>{
        this._logger.debug("DSS LIST: ",data.body)
        data.body.forEach(element => {
            this._logger.debug("DSS: ",element.dssModelName);
            this._logger.debug("DSS IS VALID?: ",element.isValid);
            if(element.isValid) {
                this._logger.debug("DSS VALID!");
                this.dssList.push(element);
            }
        });
        this.remoteCallLoading = false;
        if(this.dssList.length > 1) {
            this.showComparisonDSS = true;
        }
        this._logger.debug("DSS LIST: ",this.dssList)
    });
    
    }

    onConfirmSelectedModels(): void {
        //let selectedModelsId: string[] = this.modelSelectionForm.get('modelSelection').get('modelId').value;
        this._dssSelectionService.getDssToCompare(this.selectedModelsId).subscribe(
            (response: HttpResponse<IDssFlat[]>) => {
              this.dssInComparison = response.body;
              if(this.dssInComparison.length > 0) {
                this.areModelsSelected = true;
                this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_comparison_models_retrived","Common_labels.Success","toast-success");
              } else {
                this.areModelsSelected = false;
                this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_comparison_model_retrived_error","Common_labels.Error","toast-error");
              }
            },
            (error: HttpErrorResponse) => {
              this._logger.error("Dss comparison error",error);
              this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_comparison_model_retrived_error","Common_labels.Error","toast-error");
            }
        );
    }

    ngOnDestroy() {
        
    }

    formInit() {
        this.modelSelectionForm = this._fb.group({
          modelSelection: this.createModelSelection()
        });
    }

    createModelSelection(): FormGroup {
        return this._fb.group({
          modelId: ["", Validators.required]
        });
    }

   checkSelectedModelsLenght(): boolean {
        //const selectedModelsId: string[] = this.modelSelectionForm.get('modelSelection').get('modelId').value;
        if((this.selectedModelsId.length > 1)){
            return true
        } else {
            return false
        }
    }

    onSelectModel(modelId: string): void {
        const index = this.getSelectedModelIndex(modelId);
        if (index < 0){
            this.numberOfModelSelected++;
            this.selectedModelsId.push(modelId);
        }
    }
    
    onDeselectModel(modelId: string): void {
        this.numberOfModelSelected--;
        const index = this.getSelectedModelIndex(modelId);
        this.selectedModelsId.splice(index,1);
    }

    private getSelectedModelIndex(modelId: String): number {
        const index: number = this.selectedModelsId.findIndex((id)=>{
          if(id === modelId) {
              return true
            }
        });
        return index;
    }
}