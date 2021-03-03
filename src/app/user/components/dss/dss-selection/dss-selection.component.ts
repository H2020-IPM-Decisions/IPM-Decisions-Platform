import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
declare var JSONEditor;

@Component({
  selector: "app-dss-selection",
  templateUrl: "./dss-selection.component.html",
  styleUrls: ["./dss-selection.component.css"],
})
export class DssSelectionComponent implements OnInit {

  searchForm: FormGroup = this._fb.group({
    cropSearch: [''],
    pestSearch: ['']
  })
  crops: { value: string; label: string }[] = [];
  pests: { value: string; label: string }[] = [];
  models;
  selectedModal = new FormControl('');
  editor;
  editorActivated = false;


  updateModels() {
    var { cropSearch, pestSearch } = this.searchForm.value;
    var requestUrl = "";
    this.purgeEditor();
    if (cropSearch && pestSearch) {
      requestUrl = `${environment.apiUrl}/api/dss/rest/dss/crop/${cropSearch}/pest/${pestSearch}`
    }
    else if (cropSearch) {
      requestUrl = `${environment.apiUrl}/api/dss/rest/dss/crop/${cropSearch}`
    }
    else if (pestSearch) {
      requestUrl = `${environment.apiUrl}/api/dss/rest/dss/pest/${pestSearch}`
    }
    else {
      requestUrl = `${environment.apiUrl}/api/dss/rest/dss`
    }
    this.http
      .get(requestUrl)
      .subscribe(
        (response: any) => {
          this.models = response[0].models;
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

  constructor(
    private _fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http
      .get(`${environment.apiUrl}/api/dss/rest/crop`)
      .subscribe((response: any[]) => {
        this.crops = response.map((item) => ({ value: item, label: item }))
      })

    this.http
      .get(`${environment.apiUrl}/api/dss/rest/pest`)
      .subscribe((response: any[]) => {
        this.pests = response.map((item) => ({ value: item, label: item }))
      })

  }

}
