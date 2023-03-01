import { Component, OnDestroy, OnInit } from "@angular/core";
import { EppoCodeService } from "@app/shared/services/upr/eppo-code.service";
import { EppoCode } from "@app/shared/models/eppo-code.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { IDssFlat, IDssFormData, DssSelection } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { HttpResponse } from "@angular/common/http";
import { NGXLogger } from 'ngx-logger';
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
  selector: "app-dss-linked-page",
  templateUrl: "./dss-linked-page.component.html",
  styleUrls: ["./dss-linked-page.component.css"]
})
export class DssLinkedPage implements OnInit, OnDestroy {
  remoteCallLoading: boolean = false;
  allLinkedDSS: IDssFlat[] = [];
  overallLinkedDSS: IDssFlat[] = [];
  linkedDSSSelectedByUser: IDssFlat[] = [];
  selectedOverallLinkedDSS: IDssFormData [] = [];
  cropsEppoCodes: EppoCode[] = [];
  selCropForm: FormGroup;
  isFiltered: boolean = false;
  isEditing: boolean = false;
  getLinkedDssListSubscription: Subscription;
  deleteLinkedDssSelectedByUserSubscription: Subscription;
  submitSelectedLinkedDssSubscription: Subscription;
  
  constructor(
    private _fb: FormBuilder,
    private _service: DssSelectionService,
    private _eppoCodeService: EppoCodeService,
    private _logger: NGXLogger,
    private _toastrTranslated: ToastrTranslationService
  ) { }

  ngOnInit(): void {
    this._logger.debug("Dss Linked Page Component Init Start");
    this.formInit();
    this._eppoCodeService.cachedRefreshableCrops$.subscribe(data=>{
      this.cropsEppoCodes=data;
      this.cropsEppoCodes = this.cropsEppoCodes.sort(function(a,b){
        return a.text.localeCompare(b.text);
      })
      this._logger.debug("CROPS LOADING COMPLETE");
    });
    this.remoteCallLoading = true;
    this.getInitData();
  }

  getInitData(): void {
    if (this.getLinkedDssListSubscription) {
      this.getLinkedDssListSubscription.unsubscribe();
    }
    this.allLinkedDSS = [];
    this.overallLinkedDSS = [];
    this.linkedDSSSelectedByUser = [];
    this.selectedOverallLinkedDSS = [];
    this.getLinkedDssListSubscription = this._service.getLinkedDssList().subscribe(
      (data: HttpResponse<DssSelection[]>)=>{
        data.body.forEach((dss) => {
          if(dss.models.length > 0){
            this.allLinkedDSS = this.allLinkedDSS.concat(this._service.convertDssSelectionModelToDssFlat(dss));
            this._logger.debug("LINKED DSS FLAT CONTENT",this.allLinkedDSS);
          }
        })
        this.filterByUserSelectedLinkedDSSList(false);
        this.remoteCallLoading = false;
      },
      errorResponse => {
        this._logger.error("GET LINKED DSS LIST ERROR: ",errorResponse);
        this.remoteCallLoading = false;
        this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_retrived_error","Common_labels.Error","toast-error");
      }
    );
  }

  getInitDataOnlyOverall(): void {
    if (this.getLinkedDssListSubscription) {
      this.getLinkedDssListSubscription.unsubscribe();
    }
    this.getLinkedDssListSubscription = this._service.getLinkedDssList().subscribe(
      (data: HttpResponse<DssSelection[]>)=>{
        this.allLinkedDSS = [];
        this.overallLinkedDSS = [];
        this.selectedOverallLinkedDSS = [];
        data.body.forEach((dss) => {
          if(dss.models.length > 0){
            this.allLinkedDSS = this.allLinkedDSS.concat(this._service.convertDssSelectionModelToDssFlat(dss));
            this._logger.debug("LINKED DSS FLAT CONTENT",this.allLinkedDSS);
          }
        })
        this.filterByUserSelectedLinkedDSSList(true);
        this.remoteCallLoading = false;
      },
      errorResponse => {
        this._logger.error("GET LINKED DSS LIST ERROR: ",errorResponse);
        this.remoteCallLoading = false;
        this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_retrived_error","Common_labels.Error","toast-error");
      }
    );
  }

  ngOnDestroy(): void {
    if (this.getLinkedDssListSubscription) {
      this.getLinkedDssListSubscription.unsubscribe();
    }
    if (this.deleteLinkedDssSelectedByUserSubscription) {
      this.deleteLinkedDssSelectedByUserSubscription.unsubscribe();
    }
    if (this.submitSelectedLinkedDssSubscription) {
      this.submitSelectedLinkedDssSubscription.unsubscribe();
    }
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

  public filterReset() {
    this._logger.debug("RESETTING FILTER",this.selCropForm.get('cropSelection').get('cropEppoCode').value);
    this.selCropForm.reset();
    this.isFiltered = false;
    this.getInitData();
    this._logger.debug("RESET COMPLETE",this.selCropForm.get('cropSelection').get('cropEppoCode').value);
  }

  public onConfirmSelectedCrops(): void {
    this._logger.debug("START Filtering by crops task");
    let cropsSelectedArray: string[] = this.selCropForm.get('cropSelection').get('cropEppoCode').value;
    const crops: string = cropsSelectedArray.join('%2C')
    this._logger.debug("CROP String to send:",crops);
    if (this.getLinkedDssListSubscription) {
      this.getLinkedDssListSubscription.unsubscribe();
    }
    this.getLinkedDssListSubscription = this._service.getLinkedDssListByMultipleCrops(crops).subscribe(
      (data: HttpResponse<DssSelection[]>)=>{
        this.allLinkedDSS = [];
        this.overallLinkedDSS = [];
        this.linkedDSSSelectedByUser = [];
        this.selectedOverallLinkedDSS = [];
        this.isFiltered = true;
        this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_models_filtered","Common_labels.Success","toast-success");
        data.body.forEach((dss) => {
          if(dss.models.length > 0){
            this.allLinkedDSS = this.allLinkedDSS.concat(this._service.convertDssSelectionModelToDssFlat(dss));
            this._logger.debug("LINKED DSS FLAT CONTENT",this.allLinkedDSS);
          }
        })
        this.filterByUserSelectedLinkedDSSList(false);
        this.remoteCallLoading = false;
        this._logger.debug("COMPLETE Filtering by crops");
      },
      errorResponse => {
        this._logger.error("GET FILTERED LINKED DSS LIST ERROR: ",errorResponse);
        this.remoteCallLoading = false;
        this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_retrived_error","Common_labels.Error","toast-error");
      }
    );
  }

  public gotData(): boolean {
    if((this.allLinkedDSS.length > 0) || (this.isFiltered)){
      return true;
    }
    return false;
  }

  public gotOverallLinkedDssData(): boolean {
    if(this.overallLinkedDSS.length > 0){
      return true;
    }
    return false;
  }

  public gotUserSelectedLinkedDssData(): boolean {
    if(this.linkedDSSSelectedByUser.length > 0){
      return true;
    }
    return false;
  }

  public isAnyDssCurrentlySelected(): boolean {
    if(this.selectedOverallLinkedDSS.length > 0){
      return true;
    }
    return false;
  }

  public filterByUserSelectedLinkedDSSList(onlyOverall: boolean): void {
    this._logger.debug("START task to filter all linked DSS that are selected by the user",this.allLinkedDSS);
    this.allLinkedDSS.forEach((element)=>{
      if(!onlyOverall) {
        if(element.alreadySavedByUser == true) {
          this.linkedDSSSelectedByUser.push(element);
          this._logger.debug("Model added into the user selected list",element);
        } else {
          this.overallLinkedDSS.push(element);
          this._logger.debug("Model added into the overall list",element);
        }
      } else {
        if(element.alreadySavedByUser == false) {
          this.overallLinkedDSS.push(element);
          this._logger.debug("Model added into the overall list",element);
        }
      }
      
    });
    this._logger.debug("COMPLETE task to filter all linked DSS that are selected by the user");
    this._logger.debug("User selected linked DSS",this.linkedDSSSelectedByUser);
    this._logger.debug("Overall linked DSS",this.overallLinkedDSS);
  }

  private getSelectedOverallLinkedDssIndex(selectedLinkedDss: IDssFormData): number {
    const index: number = this.selectedOverallLinkedDSS.findIndex((element)=>{
      if((element.dssModelId === selectedLinkedDss.dssModelId))
      {return true}
    });
    return index;
  }

  private getUserLinkedDssIndexByID(selectedLinkedDssID: string): number {
    const index: number = this.linkedDSSSelectedByUser.findIndex((element)=>{
      if((element.dssDatabaseId === selectedLinkedDssID))
      {return true}
    });
    return index;
  }

  onSelectOverallLinkedDSS(linkedDssModelSelected: IDssFormData): void {
    this._logger.debug("Oberall Linked DSS selected List status",this.selectedOverallLinkedDSS);
    this._logger.debug("Overall linked DSS Selected",linkedDssModelSelected);
    const index = this.getSelectedOverallLinkedDssIndex(linkedDssModelSelected);
    if (index < 0){
      this.selectedOverallLinkedDSS.push(linkedDssModelSelected);
    }
    this._logger.debug("Oberall Linked DSS selected List status updated",this.selectedOverallLinkedDSS);
  }

  onDeselectOverallLinkedDSS(linkedDssModelSelected: IDssFormData): void {
    const index = this.getSelectedOverallLinkedDssIndex(linkedDssModelSelected);
    this.selectedOverallLinkedDSS.splice(index,1);
  }

  onEditUserSelected(): boolean {
    return this.isEditing = !this.isEditing;
  }

  onDeleteUserSelectedLinkedDss(linkedDssModelID: string): void {
    this._logger.debug("REMOVING Selected Linked DSS ID",linkedDssModelID);
    if (this.deleteLinkedDssSelectedByUserSubscription) {
      this.deleteLinkedDssSelectedByUserSubscription.unsubscribe();
    }
    this.deleteLinkedDssSelectedByUserSubscription = this._service.del(linkedDssModelID).subscribe(
      () => {
        let index = this.getUserLinkedDssIndexByID(linkedDssModelID);
        this.linkedDSSSelectedByUser.splice(index,1);
        this.getInitDataOnlyOverall();
        this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_deletion","Common_labels.Success","toast-success");
      },
      () => {
        this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_deletion_error","Common_labels.Error","toast-error");
      }
    );

  }

  onSave() {
    this._logger.debug("SAVING Selected Linked DSS",this.selectedOverallLinkedDSS);
    if (this.selectedOverallLinkedDSS.length > 0) {
      if (this.submitSelectedLinkedDssSubscription) {
        this.submitSelectedLinkedDssSubscription.unsubscribe();
      }
      this.submitSelectedLinkedDssSubscription = this._service.submitLinkedDssWithoutFarmId(this.selectedOverallLinkedDSS).subscribe(
        (response) => {
          if (response) {
            this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_models_added","Common_labels.Success","toast-success");
            this.filterReset();
          }
        },
        errorResponse => {
          if(errorResponse.status===409){
            this._logger.error("Combination Exists","No DSS Submitted, a DSS with selected Crop/Pest combination already exists");
            this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_combination_error","Common_labels.Error","toast-error");
          }else{
            this._logger.error("Dss models selection error",errorResponse);
            this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_add_error","Common_labels.Error","toast-error");
          }
        }
      );
    }
  }
}