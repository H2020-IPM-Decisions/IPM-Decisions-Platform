import { DssParameters } from './dss-selection.model';
import { DssSelectionService } from './dss-selection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NGXLogger } from 'ngx-logger';
import { JsonEditorService } from './json-editor/json-editor.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';

@Component({
  selector: "app-dss-model-parametrisation",
  templateUrl: "./dss-model-parametrisation.component.html",
  styleUrls: ["./dss-model-parametrisation.component.css"],
})

export class DssModelParametrisationComponent implements OnInit, OnDestroy {

  public dssId: string; // Dss Owner Id (i.e no.nibio.vips)
  public dssModelId: string; // Model Id (i.e PSILARTEMP)
  public dssModelName: string; // Model Name (i.e. carrots rust fly model)
  public farmName: string;
  public dssDetailPage?: boolean; // Redirect from dss details view component?
  public id: string; // Id of the selected Dss from farm edit (dssId from url)
  public editor: any;
  public editorValid: boolean = false;
  public remoteCallLoading: boolean = false;

  public $subscriptionEditor: Subscription;
  public $subscriptionSubmit: Subscription;

  constructor(
    private _logger: NGXLogger,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dssSelectionService: DssSelectionService,
    private _jsonEditorService: JsonEditorService,
    private _toastrService: ToastrService,
  ) { }

  public ngOnInit(): void {
    try {
      this.remoteCallLoading = true;
      this.dssId = history.state.data.dssId;
      this.dssModelId = history.state.data.dssModelId;
      this.dssModelName = history.state.data.dssModelName;
      this.farmName = history.state.data.farmName;
      this.dssDetailPage = history.state.data.dssDetailPage;
      this._route.paramMap.subscribe(params => this.id = params.get('dssId'));
      this._logger.debug("Data Fetch:", this.dssId, this.dssModelId, this.dssModelName, this.farmName, this.id, this.dssDetailPage);
      this._dssSelectionService.getSchemaByDssIdAndModelId(this.dssId, this.dssModelId).subscribe((data) => {
        if (this.editor) {
          this._jsonEditorService.reset(this.editor);
        }
        if (this.$subscriptionEditor) {
          this.$subscriptionEditor.unsubscribe();
        }
        this.remoteCallLoading = false;
        this.editor = this._jsonEditorService.createJsonEditor('json-editor-form', data.body);
        $('#json-editor-form label').filter(function () { return $(this).text() === 'root'; }).css("display", "none");
        this.$subscriptionEditor = this._jsonEditorService.listenChanges(this.editor).subscribe(() => this.editorChanges());
      }, () => {
        this.remoteCallLoading = false;
      })
    } catch (error) {
      this._logger.error('Unable to fetch data:', error);
      throw new Error('Unable to fetch data');
    }
  }

  public ngOnDestroy(): void {
    if (this.$subscriptionEditor) {
      this.$subscriptionEditor.unsubscribe();
    }
    if (this.$subscriptionSubmit) {
      this.$subscriptionSubmit.unsubscribe();
    }
  }

  public editorChanges(): void {
    if (this.editor) {
      this.editorValid = this._jsonEditorService.isValid(this.editor);
    }
  }

  public onSubmit(): void {
    if(this.editor && this.editorValid) {
      let inputParams: DssParameters = new DssParameters(JSON.stringify(this._jsonEditorService.getValues(this.editor)))
      this.$subscriptionSubmit = this._dssSelectionService.updateDssParameters(this.id, inputParams).subscribe(
        (response) => {
          if (response) {
            this._toastrService.success("Operation Success","DSS parameters updated!");
            setTimeout(() => this.goBack(), 3000);
          }
          
          
        },
        (error) => {
          this._toastrService.error("Operation Failed","Dss parameters update failed, an error occurs");
          this._logger.error("Operation Failed:",error);
        },
      )
    }
  }

  goBack(): void {
    if(!this.dssDetailPage){
      window.history.back();
    } else {
      this._router.navigateByUrl('/user/dss/dashboard');
    }
  }
}