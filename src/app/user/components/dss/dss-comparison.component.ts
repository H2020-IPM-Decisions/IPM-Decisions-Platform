import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IDssFlat } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from "ngx-logger";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
    selector: "app-dss-comparison",
    templateUrl: "./dss-comparison.component.html",
    styleUrls: ["./dss-comparison.component.css"]
})
export class DssComparisonComponent implements OnInit, OnDestroy {

    remoteCallLoading: boolean = false;
    $startSubscription: Subscription;
    dssList: IDssFlat[] = [];
    modelSelectionForm: FormGroup;
    dssInComparison: IDssFlat[];
    areModelsSelected: boolean = false;
    //fakeData: IDssFlat[] = JSON.parse("[{\"resultParameters\":[{\"code\":\"T-Sum\",\"title\":\"T-Sum\",\"description\":\"Cumulative day degrees over 3 degrees celsius.\",\"data\":[73.81129176045457,73.81129176045457,73.81129176045457,73.81129176045457,73.81129176045457,73.81129176045457,73.81129176045457],\"labels\":[\"01\/06\/2022\",\"01\/07\/2022\",\"01\/08\/2022\",\"01\/09\/2022\",\"01\/10\/2022\",\"01\/11\/2022\",\"01\/12\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"Count\",\"chartType\":\"line\",\"color\":\"orange\"}},{\"code\":\"Proportion of day where temperature exceeds 11 degrees C\",\"title\":null,\"description\":null,\"data\":[0,0,0,0,0,0,0],\"labels\":[\"01\/06\/2022\",\"01\/07\/2022\",\"01\/08\/2022\",\"01\/09\/2022\",\"01\/10\/2022\",\"01\/11\/2022\",\"01\/12\/2022\"],\"chartInformation\":null},{\"code\":\"Proportion of day where temperature was below 6 degrees C\",\"title\":null,\"description\":null,\"data\":[1,1,1,1,1,1,1],\"labels\":[\"01\/06\/2022\",\"01\/07\/2022\",\"01\/08\/2022\",\"01\/09\/2022\",\"01\/10\/2022\",\"01\/11\/2022\",\"01\/12\/2022\"],\"chartInformation\":null},{\"code\":\"Proportion of day where temperature was below 3 degrees C\",\"title\":null,\"description\":null,\"data\":[1,1,0.9583333333333334,0.9583333333333334,1,1,0.9166666666666666],\"labels\":[\"01\/06\/2022\",\"01\/07\/2022\",\"01\/08\/2022\",\"01\/09\/2022\",\"01\/10\/2022\",\"01\/11\/2022\",\"01\/12\/2022\"],\"chartInformation\":null}],\"outputTimeStart\":\"2021-09-01T00:00:00Z\",\"outputTimeEnd\":\"2022-01-12T00:00:00Z\",\"warningStatusPerDay\":[3,3,3,3,3,3,3],\"warningStatusLabels\":[\"01\/06\/2022\",\"01\/07\/2022\",\"01\/08\/2022\",\"01\/09\/2022\",\"01\/10\/2022\",\"01\/11\/2022\",\"01\/12\/2022\"],\"interval\":\"3600\",\"dssTypeOfOutput\":\"Risk indication\",\"dssTypeOfDecision\":\"Short-term tactical\",\"resultParametersLength\":7,\"resultParametersWidth\":4,\"chartGroups\":[{\"id\":\"G1\",\"title\":\"TSUM\",\"resultParameterIds\":[\"T-Sum\",\"Proportion_1\",\"Proportion_2\",\"Proportion_3\"],\"resultParameters\":[{\"code\":\"T-Sum\",\"title\":\"T-Sum\",\"description\":\"Cumulative day degrees over 3 degrees celsius.\",\"data\":[73.81129176045457,73.81129176045457,73.81129176045457,73.81129176045457,73.81129176045457,73.81129176045457,73.81129176045457],\"labels\":[\"01\/06\/2022\",\"01\/07\/2022\",\"01\/08\/2022\",\"01\/09\/2022\",\"01\/10\/2022\",\"01\/11\/2022\",\"01\/12\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"Count\",\"chartType\":\"line\",\"color\":\"orange\"}}]}],\"id\":\"707e33ef-cdd2-4d61-8d1a-82b39076323c\",\"farmId\":\"bf71c962-d3fd-48e9-8b70-3a191fcb42ad\",\"farmName\":\"Farm1\",\"fieldId\":\"be5ded35-9a42-4f56-8feb-b2afed1475cc\",\"creationDate\":\"2022-02-07T16:13:03.993249\",\"isValid\":true,\"cropEppoCode\":\"TRZAW\",\"cropLanguages\":{\"en\":\"Winter wheat\",\"la\":\"Triticum aestivum (winter)\"},\"pestEppoCode\":\"RHOPPA\",\"pestLanguages\":null,\"dssId\":\"adas.dss\",\"dssName\":\"Models\",\"dssModelId\":\"RHOPPA\",\"dssModelName\":\"TSUM Model\",\"dssVersion\":null,\"dssModelVersion\":\"0.0.1\",\"dssExecutionType\":\"onthefly\",\"dssEndPoint\":\"https:\/\/app-rsk-adas-dss-dev-001.azurewebsites.net\/dss\/rhoppa\/Help\/Api\/POST-api-RHOPPA\",\"warningStatus\":3,\"warningStatusRepresentation\":\"Yellow risk status: T-SUM is between 50 and 100. \",\"warningMessage\":\"Review risk status within next 3 days. Field inspections recommended within the next 3-5 days to assess aphid infestations and consider treatment where winged aphids are easily found.\",\"resultMessageType\":null,\"resultMessage\":\"\"},{\"resultParameters\":[{\"code\":\"TMDD5C\",\"title\":\"Accumulated day degrees\",\"description\":\"The accumulated day degrees with a base temperature of 5 degrees celcius\",\"data\":[0,0,1.38,2.39,2.39],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"°C\",\"chartType\":\"spline\",\"color\":\"#0033cc\"}},{\"code\":\"THRESHOLD_1\",\"title\":\"Threshold for start of flight period\",\"description\":\"When the accumulated day degrees exceed this threshold, the flight period is starting up\",\"data\":[260,260,260,260,260],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"°C\",\"chartType\":\"spline\",\"color\":\"#ffff00\"}},{\"code\":\"THRESHOLD_2\",\"title\":\"Threshold for peak flight period\",\"description\":\"When the accumulated day degrees exceed this threshold, you enter the peak flight period\",\"data\":[360,360,360,360,360],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"°C\",\"chartType\":\"spline\",\"color\":\"#ff0000\"}},{\"code\":\"TMD5C\",\"title\":null,\"description\":null,\"data\":[0,0,1.38,1.02,0],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":null},{\"code\":\"TMD\",\"title\":null,\"description\":null,\"data\":[3.81,3.4,6.38,6.02,4.8],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":null},{\"code\":\"THRESHOLD_3\",\"title\":\"Threshold for end of 1st generation flight period\",\"description\":\"When the accumulated day degrees exceed this threshold, the 1st generation flight period is over\",\"data\":[560,560,560,560,560],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"°C\",\"chartType\":\"spline\",\"color\":\"#999999\"}}],\"outputTimeStart\":\"2022-02-01T23:00:00Z\",\"outputTimeEnd\":\"2022-02-05T23:00:00Z\",\"warningStatusPerDay\":[2,2,2,2,2],\"warningStatusLabels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"interval\":\"86400\",\"dssTypeOfOutput\":\"Risk indication\",\"dssTypeOfDecision\":\"Short-term tactical\",\"resultParametersLength\":5,\"resultParametersWidth\":6,\"chartGroups\":[{\"id\":\"G1\",\"title\":\"Day degrees\",\"resultParameterIds\":[\"TMDD5C\",\"THRESHOLD_1\",\"THRESHOLD_2\",\"THRESHOLD_3\"],\"resultParameters\":[{\"code\":\"TMDD5C\",\"title\":\"Accumulated day degrees\",\"description\":\"The accumulated day degrees with a base temperature of 5 degrees celcius\",\"data\":[0,0,1.38,2.39,2.39],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"°C\",\"chartType\":\"spline\",\"color\":\"#0033cc\"}},{\"code\":\"THRESHOLD_1\",\"title\":\"Threshold for start of flight period\",\"description\":\"When the accumulated day degrees exceed this threshold, the flight period is starting up\",\"data\":[260,260,260,260,260],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"°C\",\"chartType\":\"spline\",\"color\":\"#ffff00\"}},{\"code\":\"THRESHOLD_2\",\"title\":\"Threshold for peak flight period\",\"description\":\"When the accumulated day degrees exceed this threshold, you enter the peak flight period\",\"data\":[360,360,360,360,360],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"°C\",\"chartType\":\"spline\",\"color\":\"#ff0000\"}},{\"code\":\"THRESHOLD_3\",\"title\":\"Threshold for end of 1st generation flight period\",\"description\":\"When the accumulated day degrees exceed this threshold, the 1st generation flight period is over\",\"data\":[560,560,560,560,560],\"labels\":[\"02\/01\/2022\",\"02\/02\/2022\",\"02\/03\/2022\",\"02\/04\/2022\",\"02\/05\/2022\"],\"chartInformation\":{\"defaultVisible\":true,\"unit\":\"°C\",\"chartType\":\"spline\",\"color\":\"#999999\"}}]}],\"id\":\"91a278b7-902d-4b80-a5d2-65984bf82f84\",\"farmId\":\"3fd41f5f-e76c-4c73-ba7e-58f5f9f0b4de\",\"farmName\":\"Farm2\",\"fieldId\":\"a58f7391-6e58-4862-8a62-b6c236bab266\",\"creationDate\":\"2022-02-14T00:00:24.199403\",\"isValid\":true,\"cropEppoCode\":\"DAUCS\",\"cropLanguages\":{\"en\":\"Garden carrot\",\"la\":\"Daucus carota subsp. sativus\"},\"pestEppoCode\":\"PSILRO\",\"pestLanguages\":{\"en\":\"Carrot rust fly\",\"la\":\"Psila rosae\"},\"dssId\":\"no.nibio.vips\",\"dssName\":\"VIPS\",\"dssModelId\":\"PSILARTEMP\",\"dssModelName\":\"Carrot rust fly temperature model\",\"dssVersion\":null,\"dssModelVersion\":\"1.0\",\"dssExecutionType\":\"onthefly\",\"dssEndPoint\":\"https:\/\/www.vips-landbruk.no\/forecasts\/models\/PSILARTEMP\/\",\"warningStatus\":2,\"warningStatusRepresentation\":\"The flight period has not yet begun.\",\"warningMessage\":\"No action needed. Consider deploying yellow sticky traps in your fields when 260 degree-days is approching.\",\"resultMessageType\":null,\"resultMessage\":\"\"}]");
    constructor(
        protected _dssSelectionService: DssSelectionService,
        private _logger: NGXLogger,
        private _fb: FormBuilder,
        private _toastrTranslated: ToastrTranslationService
    ) { }

    // TRUE INIT TO USE WHEN REAL DATA IS AVAIABLE
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
        this._logger.debug("DSS LIST: ",this.dssList)
    });
    }

    onConfirmSelectedModels(): void {
        let selectedModelsId: string[] = this.modelSelectionForm.get('modelSelection').get('modelId').value;
        this._dssSelectionService.getDssToCompare(selectedModelsId).subscribe(
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

    // INIT WITH FAKE DATA
    /*ngOnInit() {
        this.formInit();
        this.remoteCallLoading = true;
        this.dssList = this.fakeData;
        this.remoteCallLoading = false;
        this._logger.debug("DSS LIST: ",this.dssList)
    }*/

    ngOnDestroy() {
        
    }

    formInit() {
        this.modelSelectionForm = this._fb.group({
          modelSelection: this.createModelSelection()
        });
    }

    // FAKE DATA (REMOVE WHEN DEVELOP ENDS)
    /*onConfirmSelectedModels(): void {
        this.dssInComparison = this.fakeData;
        this.areModelsSelected = true;
    }*/

    createModelSelection(): FormGroup {
        return this._fb.group({
          modelId: ["", Validators.required]
        });
    }
   checkSelectedModelsLenght(): boolean {
        const selectedModelsId: string[] = this.modelSelectionForm.get('modelSelection').get('modelId').value;
        if(selectedModelsId.length > 1){
            return true
        } else {
            return false
        }
    }
    
}