import { environment } from '@src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup
} from "@angular/forms";
import { DssSelectionService } from './dss-selection.service';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DssSelection } from './dss-selection.model';

declare var JSONEditor;

@Component({
  selector: "app-dss-selection",
  templateUrl: "./dss-selection.component.html",
  styleUrls: ["./dss-selection.component.css"],
})
export class DssSelectionComponent implements OnInit, OnDestroy {
  
  searchForm: FormGroup;
  crops: { value: string; label: string }[] = [];
  pests: { value: string; label: string }[] = [];
  models;
  selectedModal = new FormControl('');
  editor;
  editorActivated = false;
  $subscriptionS1: Subscription;
  $subscriptionS2: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dssSelectionService: DssSelectionService
  ) { }


  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      cropSearch: [''],
      pestSearch: ['']
    })
    this.$subscriptionS1 = this.dssSelectionService.getCrops()
      .pipe(
        mergeMap( (response: HttpResponse<string[]>) => {
          this.crops = response.body.map((item) => ({ value: item, label: item }));
          return this.dssSelectionService.getPests();
        })
      ).subscribe(
        (response: HttpResponse<string[]>) => {
          this.pests = response.body.map((item) => ({ value: item, label: item }))
        }
      );
  }

  ngOnDestroy() {
    if(this.$subscriptionS1){
      this.$subscriptionS1.unsubscribe();
    }
    if(this.$subscriptionS2){
      this.$subscriptionS2.unsubscribe();
    }
  }

  updateModels() {
    var { cropSearch, pestSearch } = this.searchForm.value;
    this.purgeEditor();
    this.$subscriptionS2 = this.dssSelectionService.getModels(cropSearch,pestSearch)
      .subscribe(
        (response: HttpResponse<DssSelection[]>) => {
          this.models = response.body[0].models;
        },
        (err) => {
          this.models = null;
          alert("We couldn't find any models matching the given criteria")
        }
      )
  }

  updateForm() {
    this.purgeEditor();
    this.editorActivated = true;
    setTimeout(() => {
      let modelIndex = this.selectedModal.value;
      let editorHolder = document.getElementById('editor_holder');
      let schema = JSON.parse(this.models[modelIndex].execution.input_schema);
      this.editor = new JSONEditor(editorHolder, {
        schema,
        ajax: true,
        theme: 'bootstrap4'
      });
    }, 0);
  }

  purgeEditor() {
    if (this.editor instanceof JSONEditor) {
      this.editor.destroy();
      this.editorActivated = false;
    }
  }

  submit() {
    let editor = this.editor;
    let modelIndex = this.selectedModal.value;
    let currentModel = this.models[modelIndex];
    let { endpoint, form_method } = currentModel.execution;
    if (editor.validate().length == 0) {
      if (form_method == 'post') {
        this.http
          .post(endpoint, this.editor.getValue())
          .subscribe((x) => { alert(x) })
      }
    } else {
      alert("Error");
    }
  }  

}
