import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Farm } from "@app/shared/models/farm.model";
import { Field } from "@app/shared/models/field.model";
import { IDssFormData, DssSelection } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { EppoCodeService } from "@app/shared/services/upr/eppo-code.service";
import { EppoCode } from "@app/shared/models/eppo-code.model";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import { ICountryCode } from './../../../shared/interfaces/country-code.interface';
import * as isoConverter from 'iso-3166-1';

@Component({
  selector: "app-dss-model-add",
  templateUrl: "./dss-model-add.component.html",
  styleUrls: ["./dss-model-add.component.css"],
})
export class DssModelAddComponent implements OnInit {
  selCropForm: FormGroup;
  farm: Farm;
  field: Field;
  areCropsSelected: boolean = false;
  selectedDss: IDssFormData[] = [];
  data: DssSelection[] = [];
  cropsEppoCodes: EppoCode[] = [];
  countries: ICountryCode[] = [];
  countryFilterActive: boolean = false;
  selectedCountry: string = "";
  $subscription?: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _dssSelectionService: DssSelectionService,
    private _eppoCodeService: EppoCodeService,
    private _activatedRoute: ActivatedRoute,
    private _logger: NGXLogger,
    private _toastrTranslated: ToastrTranslationService
  ) {}

  ngOnInit() {
    this.formInit();
    this._eppoCodeService.cachedRefreshableCrops$.subscribe(data=>{
      this.cropsEppoCodes=data
    });
    this.$subscription = this._activatedRoute.data.subscribe(({ farm }) => {
      this.farm = farm;
    });
    this.countries = isoConverter.all();
  }

  formInit() {
    this.selCropForm = this._fb.group({
      cropSelection: this.createCropSelection()
    });
  }

  createCropSelection(): FormGroup {
    return this._fb.group({
      cropEppoCode: ["", Validators.required]
    });
  }

  private getSelectedDssIndex(selectedDss: IDssFormData): number {
    const index: number = this.selectedDss.findIndex((element)=>{
      if((element.dssModelId === selectedDss.dssModelId)&&
      (element.cropEppoCode === selectedDss.cropEppoCode)&&
      (element.pestEppoCode === selectedDss.pestEppoCode))
      {return true}
    });
    return index;
  }

  onSelectDSS(dssModelSelected: IDssFormData): void {
    const index = this.getSelectedDssIndex(dssModelSelected);
    if (index < 0){
      this.selectedDss.push(dssModelSelected);
    }
  }

  onDeselectDSS(dssModelSelected: IDssFormData): void {
    const index = this.getSelectedDssIndex(dssModelSelected);
    this.selectedDss.splice(index,1);
  }
  
  onConfirmSelectedCrops(): void {
    let cropsSelectedArray: string[] = this.selCropForm.get('cropSelection').get('cropEppoCode').value;
    const crops: string = cropsSelectedArray.join('%2C')
    if (this.countryFilterActive && (this.selectedCountry != "")) {
      this._dssSelectionService.getDssByMultipleCropsAndFarmLocationFilteredByCountry(crops,this.farm.location.y,this.farm.location.x,this.selectedCountry).subscribe(
        (response: HttpResponse<DssSelection[]>) => {
          this.data = response.body;
          this.removeWxNotValidatedDSS(this.data);
          if(this.data.length > 0) {
            this.areCropsSelected = true;
            
            this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_models_retrived","Common_labels.Success","toast-success");
          } else {
            this.areCropsSelected = false;
            this._toastrTranslated.showTranslatedToastr("Warning_messages.DSS_model_avaiability_error","Common_labels.Warning","toast-warning");
          }
        },
        (error: HttpErrorResponse) => {
          this._logger.error("Dss models selection error",error);
          this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_retrived_error","Common_labels.Error","toast-error");
        }
      );
    } else {
      this._dssSelectionService.getDssByMultipleCropsAndFarmLocation(crops,this.farm.location.y,this.farm.location.x).subscribe(
        (response: HttpResponse<DssSelection[]>) => {
          this.data = response.body;
          this.removeWxNotValidatedDSS(this.data);
          if(this.data.length > 0) {
            this.areCropsSelected = true;
            
            this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_models_retrived","Common_labels.Success","toast-success");
          } else {
            this.areCropsSelected = false;
            this._toastrTranslated.showTranslatedToastr("Warning_messages.DSS_model_avaiability_error","Common_labels.Warning","toast-warning");
          }
        },
        (error: HttpErrorResponse) => {
          this._logger.error("Dss models selection error",error);
          this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_retrived_error","Common_labels.Error","toast-error");
        }
      );
    }
  }

  onSave() {
    if (this.selectedDss.length > 0) {
      this._dssSelectionService.submitDss(this.selectedDss,this.farm).subscribe(
        (response) => {
          if (response) {
            this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_models_added","Common_labels.Success","toast-success");
            this.goBack();
          }
        },
        (error: HttpErrorResponse) => {
          if(error.status===409){
            this._logger.error("Combination Exists","No DSS Submitted, a DSS with selected Crop/Pest combination already exists");
            this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_combination_error","Common_labels.Error","toast-error");
          }else{
            this._logger.error("Dss models selection error",error);
            this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_add_error","Common_labels.Error","toast-error");
          }
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.$subscription) {
      this.$subscription.unsubscribe();
    }
  }

  goBack(): void {
    window.history.back();
  }

  removeWxNotValidatedDSS(dssArray: DssSelection[]): void {
    this._logger.debug("DSS LENGTH: ",dssArray.length);
    for (let i:number = 0; i < dssArray.length; i++) {
      this._logger.debug("MODELS LENGTH: ",dssArray[i].models.length);
      if (dssArray[i].models.length > 0) {
        for (let j:number = 0; j < dssArray[i].models.length; j++) {
          this._logger.debug("MODEL NAME: ",dssArray[i].models[j].name);
          this._logger.debug("MODEL WX VALIDATION: ",dssArray[i].models[j].weatherParametersValidated);
          if (!dssArray[i].models[j].weatherParametersValidated) {
            this._logger.debug("MODEL WX NOT VALID");
            this._logger.info("Weather parameters not valid for the following model: ",dssArray[i].models[j].name);
            this._toastrTranslated.showTranslatedToastrWithOptions("Warning_messages.Weather_parameters_not_avaiable","Common_labels.Warning","toast-warning",dssArray[i].models[j].name+": ",'');
            dssArray[i].models.splice(j,1);
            j--;
            this._logger.debug("MODELS LENGTH: ",dssArray[i].models.length);
          }
        }
        if (dssArray[i].models.length < 1){
          dssArray.splice(i,1);
          i--;
          this._logger.debug("DSS LENGTH: ",dssArray.length);
        }
      } else {
        dssArray.splice(i,1);
        i--;
        this._logger.debug("DSS LENGTH: ",dssArray.length);
      }
    }
  }

  onCheckboxChange():void {
    this.countryFilterActive = !this.countryFilterActive;
  }

  countryFilterChange(event: { target: HTMLInputElement }):void {
    this.selectedCountry = event.target.value;
  }
}
