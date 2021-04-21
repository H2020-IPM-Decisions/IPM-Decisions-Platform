import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DssSelectionService } from './dss-selection.service';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DssFormData, DssJSONSchema } from './dss-selection.model';
import { JsonEditorService } from './json-editor/json-editor.service';
import { ToastrService } from 'ngx-toastr';
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
  selectedDss: any;
  model: any = {};
  selectedCrop = '';
  selectedPest = '';
  crops: { value: string; label: string }[] = [];
  pests: { value: string; label: string }[] = [];
  newState = false;
  selectedOption = -1;
  models: DssJSONSchema[];
  
  $subscriptionStartup: Subscription;
  $subscriptionEditor: Subscription;
  $subscriptionS2: Subscription;

  constructor(
    private dssSelectionService: DssSelectionService,
    private jsonEditorService: JsonEditorService,
    private toastrService: ToastrService
  ) { }
    
  ngOnInit() {
    this.$subscriptionStartup = this.dssSelectionService.getCrops()
      .pipe(
        mergeMap( (response: HttpResponse<string[]>) => {
          this.crops = response.body.map((item) => ({ value: item, label: item }));
          return this.dssSelectionService.getPests();
        })
      )
      .pipe(
        mergeMap( (response: HttpResponse<string[]>) => {
          this.pests = response.body.map((item) => ({ value: item, label: item }))
          return this.dssSelectionService.getFakeModels(this.selectedCrop);
        })
      ).subscribe(
        (response: HttpResponse<DssJSONSchema[]>) => {
          this.models = response.body;
        }, () => this.toastrService.error("Unable to load initial data","Loading Error")
      );
  }

  ngOnDestroy() {
    if(this.$subscriptionStartup){
      this.$subscriptionStartup.unsubscribe();
    }
    if(this.$subscriptionS2){
      this.$subscriptionS2.unsubscribe();
    }
    if(this.$subscriptionEditor){
      this.$subscriptionEditor.unsubscribe();
    }
  }

  searchByCropAndPest() {
    /*let { cropSearch, pestSearch } = this.searchForm.value;
    this.$subscriptionS2 = this.dssSelectionService.getModels(cropSearch,pestSearch)
      .subscribe(
        (response: HttpResponse<DssSelection[]>) => {
          this.models = response.body[0].models;
        },
        (err) => {
          this.models = null;
          alert("We couldn't find any models matching the given criteria")
        }
      );*/
    this.$subscriptionS2 = this.dssSelectionService.getFakeModels()
      .subscribe(
        (response: HttpResponse<DssJSONSchema[]>) => {
          this.models = response.body;
        },
        (err) => {
          this.models = null;
          alert("We couldn't find any models matching the given criteria")
        }
      )
  }

  submit() {
    if(this.editor && this.editorValid) {
      const formData: DssFormData = {
        'schema': this.dssModel,
        'model': this.jsonEditorService.getValues(this.editor) 
      }
      this.dssSelectionService.submitDss(formData).subscribe(
        () => this.toastrService.success("Operation Success","DSS Submitted with data"),
        () => this.toastrService.error("Operation Failed","No DSS Submitted, an error occurs"),
      )
    }
  } 

  selectChanged(event: { target: HTMLInputElement }, type:string){
    this.newState = false;
    this.selectedOption = -1;
    if(type === 'crop'){
      this.selectedCrop = event.target.value;
    } else if(type === 'pest'){
      this.selectedPest = event.target.value;
    }
    if (this.editor) {
      this.jsonEditorService.reset(this.editor);
    }
    this.dssSelectionService.getFakeModels(this.selectedCrop, this.selectedPest)
      .subscribe(
        (response: HttpResponse<DssJSONSchema[]>) => {
          this.models = response.body;
        }
      );
  }

  selectDssChanged($event: { target: HTMLInputElement }){
    this.newState = true;
    this.selectedOption = parseInt($event.target.value);
    this.dssModel = this.models[$event.target.value];
    if (this.editor) {
      this.jsonEditorService.reset(this.editor);
    }
    if (this.$subscriptionEditor) {
      this.$subscriptionEditor.unsubscribe();
    }
    this.editor = this.jsonEditorService.createJsonEditor('json-editor-form', this.dssModel);
    this.$subscriptionEditor = this.jsonEditorService.listenChanges(this.editor).subscribe(() => this.editorChanges());
  }

  editorChanges(){
    if(this.editor){
      this.editorValid = this.jsonEditorService.isValid(this.editor);
    }
  }

}
