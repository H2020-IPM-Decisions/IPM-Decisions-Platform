import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DssSelectionService } from './dss-selection.service';
import { Subscription } from 'rxjs';
import { FarmResponseModel } from "@app/shared/models/farm-response.model";
import { IDssFormData, DssJSONSchema, DssModel, DssSelection } from './dss-selection.model';
import { JsonEditorService } from './json-editor/json-editor.service';
import { ToastrService } from 'ngx-toastr';
import { Farm } from '@app/shared/models/farm.model';
import { FarmService } from '@app/shared/services/upr/farm.service';
import { Field } from '@app/shared/models/field.model';
import { FieldService } from '@app/shared/services/upr/field.service';
@Component({
  selector: "app-dss-selection",
  templateUrl: "./dss-selection.component.html",
  styleUrls: ["./dss-selection.component.css"],
})
export class DssSelectionComponent implements OnInit, OnDestroy {
  dssForm: FormGroup;
  editor: any;
  editorValid = false;
  dssModel: DssJSONSchema;
  model: any = {};

  selectedCrop = '';
  selectedPest = '';

  remoteCallLoading = false;
  
  farmSelectIsNewState = false;
  farmSelectedOption = -1;
  farms: Farm[] = [];
  farmsLoaded = false;
  selectedFarm: Farm;
  fieldSelectIsNewState = false;
  fieldSelectedOption = -1;
  fields: Field[] = [];
  fieldsLoaded = false;
  selectedField: Field;
  dssSelectIsNewState = false;
  dssSelectedOption = -1;
  dssSelection: DssSelection;
  dssList: DssModel[];
  dssLoaded = false;
  dssSelected: DssModel;
  
  $subscriptionStartup: Subscription;
  $subscriptionSubmit: Subscription;
  $subscriptionFields: Subscription;
  $subscriptionDssList: Subscription;
  $subscriptionEditor: Subscription;
  $subscriptionDssSelection: Subscription;

  constructor(
    private dssSelectionService: DssSelectionService,
    private jsonEditorService: JsonEditorService,
    private toastrService: ToastrService,
    private farmService: FarmService,
    private fieldService: FieldService
  ) { }
    
  ngOnInit() {
    this.remoteCallLoading = true;
    this.$subscriptionStartup = this.farmService.getFarms().subscribe((response: FarmResponseModel) => {
      this.farmsLoaded = true;
      this.remoteCallLoading = false;
      if (response && response.value) {
        this.farms = response.value;
      }
    },()=>this.remoteCallLoading = false);
  }

  ngOnDestroy() {
    if(this.$subscriptionStartup){
      this.$subscriptionStartup.unsubscribe();
    }
    if(this.$subscriptionSubmit){
      this.$subscriptionSubmit.unsubscribe();
    }
    if(this.$subscriptionFields){
      this.$subscriptionFields.unsubscribe();
    }
    if(this.$subscriptionDssList){
      this.$subscriptionDssList.unsubscribe();
    }
    if(this.$subscriptionEditor){
      this.$subscriptionEditor.unsubscribe();
    }
    if(this.$subscriptionDssSelection){
      this.$subscriptionDssSelection.unsubscribe();
    }
  }

  farmSelectChanged(event: { target: HTMLInputElement }){
    // reset fields
    this.fieldSelectIsNewState = false;
    this.fieldSelectedOption = -1;
    this.fields = [];
    this.fieldsLoaded = false;
    // reset dss
    this.dssSelectIsNewState = false;
    this.dssSelectedOption = -1;
    this.dssList = [];
    this.dssLoaded = false;
    // set farm values
    this.farmSelectIsNewState = true;
    this.farmSelectedOption = parseInt(event.target.value);
    this.selectedFarm = this.farms[this.farmSelectedOption];
    // Enable spinner
    this.remoteCallLoading = true;
    // load remote field fetching by farm id
    this.$subscriptionFields = this.fieldService.getFields(this.selectedFarm.id).subscribe(
      (data: {links:any,value:Field[]}) => {
        this.remoteCallLoading = false;
        this.fields = data.value;
        this.fieldsLoaded = true;
      },
      ()=>{
        // There was an error
        this.fieldsLoaded = true;
        this.remoteCallLoading = false;
      });
  }

  fieldSelectChanged(event: { target: HTMLInputElement }){
    // reset dss
    this.dssSelectIsNewState = false;
    this.dssSelectedOption = -1;
    this.dssList = [];
    this.dssSelection = {};
    this.dssLoaded = false;
    // set field values
    this.fieldSelectIsNewState = true;
    this.fieldSelectedOption = parseInt(event.target.value);
    this.selectedField = this.fields[this.fieldSelectedOption];
    // load remote DSS fetching by crop and pest
    this.selectedCrop = this.selectedField.fieldCropDto.cropEppoCode;
    this.selectedPest = this.selectedField.fieldCropDto.fieldCropPestDto.value[0].pestEppoCode;
    // Enable spinner
    this.remoteCallLoading = true;
    // Fetch DSS by farm's crop and pest
    this.$subscriptionDssList = this.dssSelectionService.getDssByCropAndPest(this.selectedCrop,this.selectedPest)
      .subscribe(
        (response: HttpResponse<DssSelection[]>) => {
          if(response.body && response.body.length > 0 && response.body[0] && response.body[0].models){
            this.dssSelection = response.body[0];
            this.dssList = this.dssSelection.models;
          }
          this.dssLoaded = true;
          this.remoteCallLoading = false;
        },
        ()=>{
          this.remoteCallLoading = false;
        }
      );
  }

  dssSelectChanged($event: { target: HTMLInputElement }){
    this.dssSelectIsNewState = true;
    this.dssSelectedOption = parseInt($event.target.value);
    // Enable spinner
    this.remoteCallLoading = true;
    // Take JSON Schema remotely
    this.dssModel = this.dssList[$event.target.value];
    this.$subscriptionDssSelection = this.dssSelectionService.getSchemaByDssAndModel(this.dssSelection, this.dssModel).subscribe( (data) => {
      if (this.editor) {
        this.jsonEditorService.reset(this.editor);
      }
      if (this.$subscriptionEditor) {
        this.$subscriptionEditor.unsubscribe();
      }
      this.remoteCallLoading = false;
      this.editor = this.jsonEditorService.createJsonEditor('json-editor-form', data.body);
      this.$subscriptionEditor = this.jsonEditorService.listenChanges(this.editor).subscribe(() => this.editorChanges());
    },()=>{
      this.remoteCallLoading = false;
    })
  }

  editorChanges(){
    if(this.editor){
      this.editorValid = this.jsonEditorService.isValid(this.editor);
    }
  }

  submit() {
    if(this.editor && this.editorValid) {
      const formData: IDssFormData = this.dssSelectionService.getFormData(
                                      this.selectedField,
                                      this.selectedCrop,
                                      this.selectedPest,
                                      this.dssSelection,
                                      this.dssModel,
                                      this.jsonEditorService.getValues(this.editor)
                                    );
      this.$subscriptionSubmit = this.dssSelectionService.submitDss(formData, this.selectedFarm).subscribe(
        () => {
          this.toastrService.success("Operation Success","DSS Submitted with data");
          this.reset();
        },
        () => this.toastrService.error("Operation Failed","No DSS Submitted, an error occurs"),
      )
    }
  } 

  reset():void {
    // reset fields
    this.fieldSelectIsNewState = false;
    this.fieldSelectedOption = -1;
    this.fields = [];
    this.fieldsLoaded = false;
    // reset dss
    this.dssSelectIsNewState = false;
    this.dssSelectedOption = -1;
    this.dssList = [];
    this.dssLoaded = false;
    // set farm none
    this.farmSelectIsNewState = false;
    this.farmSelectedOption = -1;
    this.selectedFarm = null;
  }

}
