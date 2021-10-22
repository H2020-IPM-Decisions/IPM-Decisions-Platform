import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Farm } from "@app/shared/models/farm.model";
import { Field } from "@app/shared/models/field.model";
import { IDssFormData, DssSelection } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { EppoCodeService } from "@app/shared/services/upr/eppo-code.service";
import { EppoCode } from "@app/shared/models/eppo-code.model";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { NGXLogger } from "ngx-logger";

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
  $subscription?: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrService,
    private _dssSelectionService: DssSelectionService,
    private _eppoCodeService: EppoCodeService,
    private _activatedRoute: ActivatedRoute,
    private _logger: NGXLogger
  ) {}

  ngOnInit() {
    this.formInit();
    this._eppoCodeService.cachedRefreshableCrops$.subscribe(data=>{
      this.cropsEppoCodes=data
    });
    this.$subscription = this._activatedRoute.data.subscribe(({ farm }) => {
      this.farm = farm;
    });
    
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
    this._dssSelectionService.getDssByMultipleCrops(crops).subscribe(
      (response: HttpResponse<DssSelection[]>) => {
        this.data = response.body;
        this.areCropsSelected = true;
        this._toastr.show(
          "DSS Models retrivied successfully!",
          "Success!",
          null,
          "toast-success"
        );
      },
      (error: HttpErrorResponse) => {
        this._logger.error("Dss models selection error",error);
        this._toastr.show(
          "Fail to get the requested models for selected crops!",
          "Error!",
          null,
          "toast-error"
        );
      }
    );
  }

  onSave() {
    if (this.selectedDss.length > 0) {
      this._dssSelectionService.submitDss(this.selectedDss,this.farm).subscribe(
        (response) => {
          if (response) {
            this._toastr.show(
              "DSS Models added successfully!",
              "Success!",
              null,
              "toast-success"
            );
            this.goBack();
          }
        },
        (error: HttpErrorResponse) => {
          if(error.status===409){
            this._logger.error("Combination Exists","No DSS Submitted, a DSS with selected Crop/Pest combination already exists");
            this._toastr.error("Combination Exists","No DSS Submitted, a DSS with selected Crop/Pest combination already exists");
          }else{
            this._logger.error("Dss models selection error",error);
            this._toastr.show(
              "Fail to submit the selected models!",
              "Error!",
              null,
              "toast-error"
            );
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
}
