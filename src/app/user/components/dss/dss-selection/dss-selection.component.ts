import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DssSelectionService } from './dss-selection.service';
import { Subscription } from 'rxjs';
import { FarmResponseModel } from "@app/shared/models/farm-response.model";
import { DssFormData, DssJSONSchema, DssModel, DssSelection } from './dss-selection.model';
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
  
  farmSelectIsNewState = false;
  farmSelectedOption = -1;
  farms: Farm[] = [];
  selectedFarm: Farm;
  fieldSelectIsNewState = false;
  fieldSelectedOption = -1;
  fields: Field[] = [];
  selectedField: Field;
  dssSelectIsNewState = false;
  dssSelectedOption = -1;
  dssSelection: DssSelection;
  dssList: DssModel[];
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
    this.$subscriptionStartup = this.farmService.getFarms().subscribe((response: FarmResponseModel) => {
      if (response && response.value) {
        this.farms = response.value;
      }
    });
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
    // reset dss
    this.dssSelectIsNewState = false;
    this.dssSelectedOption = -1;
    this.dssList = [];
    // set farm values
    this.farmSelectIsNewState = true;
    this.farmSelectedOption = parseInt(event.target.value);
    this.selectedFarm = this.farms[this.farmSelectedOption];
    // load remote field fetching by farm id
    this.$subscriptionFields = this.fieldService.getFields(this.selectedFarm.id).subscribe(
      (data: {links:any,value:Field[]}) => {
        this.fields = data.value;
      });
  }

  fieldSelectChanged(event: { target: HTMLInputElement }){
    // reset dss
    this.dssSelectIsNewState = false;
    this.dssSelectedOption = -1;
    this.dssList = [];
    this.dssSelection = {};
    // set field values
    this.fieldSelectIsNewState = true;
    this.fieldSelectedOption = parseInt(event.target.value);
    this.selectedField = this.fields[this.fieldSelectedOption];
    // load remote DSS fetching by crop and pest
    this.selectedCrop = this.selectedField.fieldCropDto.cropEppoCode;
    this.selectedPest = this.selectedField.fieldCropDto.fieldCropPestDto.value[0].pestEppoCode;
    // Fetch DSS by farm's crop and pest
    this.$subscriptionDssList = this.dssSelectionService.getDssByCropAndPest(this.selectedCrop,this.selectedPest)
      .subscribe(
        (response: HttpResponse<DssSelection[]>) => {
          this.dssSelection = response.body[0];
          this.dssList = this.dssSelection.models;
        }
      );
  }

  dssSelectChanged($event: { target: HTMLInputElement }){
    this.dssSelectIsNewState = true;
    this.dssSelectedOption = parseInt($event.target.value);
    // Take JSON Schema remotely
    this.dssModel = this.dssList[$event.target.value];
    this.$subscriptionDssSelection = this.dssSelectionService.getSchemaByDssAndModel(this.dssSelection, this.dssModel).subscribe( (data) => {
      if (this.editor) {
        this.jsonEditorService.reset(this.editor);
      }
      if (this.$subscriptionEditor) {
        this.$subscriptionEditor.unsubscribe();
      }
      this.editor = this.jsonEditorService.createJsonEditor('json-editor-form', data.body);
      this.$subscriptionEditor = this.jsonEditorService.listenChanges(this.editor).subscribe(() => this.editorChanges());
    })
  }

  editorChanges(){
    if(this.editor){
      this.editorValid = this.jsonEditorService.isValid(this.editor);
    }
  }

  submit() {
    if(this.editor && this.editorValid) {
      const formData: DssFormData = this.dssSelectionService.getFormData(
                                      this.selectedField,
                                      this.selectedCrop,
                                      this.selectedPest,
                                      this.dssSelection,
                                      this.dssModel,
                                      this.jsonEditorService.getValues(this.editor)
                                    );
      this.$subscriptionSubmit = this.dssSelectionService.submitDss(formData, this.selectedFarm).subscribe(
        () => this.toastrService.success("Operation Success","DSS Submitted with data"),
        () => this.toastrService.error("Operation Failed","No DSS Submitted, an error occurs"),
      )
    }
  } 

}
