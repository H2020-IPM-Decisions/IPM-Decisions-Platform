import { DssParameters, IDssParameters } from './dss-selection.model';
import { DssSelectionService } from './dss-selection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NGXLogger } from 'ngx-logger';
import { JsonEditorService } from './json-editor/json-editor.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import * as $ from 'jquery';

@Component({
  selector: "app-dss-model-parametrisation",
  templateUrl: "./dss-model-parametrisation.component.html",
  styleUrls: ["./dss-model-parametrisation.component.css"],
})

export class DssModelParametrisationComponent implements OnInit, OnDestroy {
  private historyStateData: any;
  public dssId: string; // Dss Owner Id (i.e no.nibio.vips)
  public dssModelId: string; // Model Id (i.e PSILARTEMP)
  public dssModelName: string; // Model Name (i.e. carrots rust fly model)
  public farmName: string;
  public dssDetailPage?: boolean; // Redirect from dss details view component?
  public id: string; // Id of the selected Dss from farm edit (dssId from url)
  public editor: any;
  public editorValid: boolean = false;
  public remoteCallLoading: boolean = false;
  public dssParameters: any;

  public $subscriptionEditor: Subscription;
  public $subscriptionSubmit: Subscription;
  public $subscriptionParameters: Subscription;

  constructor(
    private _logger: NGXLogger,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dssSelectionService: DssSelectionService,
    private _jsonEditorService: JsonEditorService,
    private _toastrService: ToastrService,
    private _toastrTranslated: ToastrTranslationService
  ) { }

  public ngOnInit(): void {
    this.remoteCallLoading = true;
    try {
      if(window.location.href == sessionStorage.getItem("origin")){
          this.loadSessionStorageItems();
        } else {
          this.deleteSessionStorageItems();
          this.setHistoryData();
      }
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
      this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_parameters_fetching_error","Common_labels.Error","toast-error");
      this._logger.error('Unable to fetch data:', error);
      throw new Error('Unable to fetch data');
    }

    if (this.$subscriptionParameters) {
      this.$subscriptionParameters.unsubscribe();
    }

    this.$subscriptionParameters = this._dssSelectionService.getDssParameters(this.id).subscribe((parameters: IDssParameters) => {
      this.dssParameters = parameters.dssParameters;
      this._logger.debug(this.dssParameters);
    })
  }

  public ngOnDestroy(): void {
    if (this.$subscriptionEditor) {
      this.$subscriptionEditor.unsubscribe();
    }
    if (this.$subscriptionSubmit) {
      this.$subscriptionSubmit.unsubscribe();
    }
    if (this.$subscriptionParameters) {
      this.$subscriptionParameters.unsubscribe();
    }
    this.deleteSessionStorageItems();
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
            this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_parameters_updated","Common_labels.Success","toast-success");
            setTimeout(() => this.goBack(), 5000);
          }
          
          
        },
        (error) => {
          this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_parameters_update_error","Common_labels.Error","toast-error");
          this._logger.error("Operation Failed:",error);
        },
      )
    }
  }

  goBack(): void {
    if(!this.dssDetailPage){
      this.deleteSessionStorageItems();
      window.history.back();
    } else {
      this._router.navigateByUrl('/user/dss/dashboard');
    }
  }

  public isObject(val: any): boolean {
    if (!val) { return false; }
    return ((typeof val === 'function') || (typeof val === 'object'));
  };
  private fillDataProperties(): void {
    this.dssId = this.historyStateData.dssId;
    this.dssModelId = this.historyStateData.dssModelId;
    this.dssModelName = this.historyStateData.dssModelName;
    this.farmName = this.historyStateData.farmName;
    this.dssDetailPage = this.historyStateData.dssDetailPage;
  }
  private setHistoryData(): void {
    this.historyStateData = history.state.data;
    this._route.paramMap.subscribe(params => this.id = params.get('dssId'));
    this.fillDataProperties();
    sessionStorage.setItem("ParametrisationData",JSON.stringify(this.historyStateData));
    sessionStorage.setItem("ParametrisationId", this.id);
    window.onbeforeunload = function(){
      sessionStorage.setItem("origin", window.location.href);
    }
  }
  private loadSessionStorageItems(): void {
    this.historyStateData = JSON.parse(sessionStorage.getItem("ParametrisationData"));
    this.id = sessionStorage.getItem("ParametrisationId");
    this.fillDataProperties();
  }
  private deleteSessionStorageItems(): void {
    sessionStorage.removeItem("ParametrisationId");
    sessionStorage.removeItem("ParametrisationData");
    if (sessionStorage.getItem("origin")) {
      sessionStorage.removeItem("origin");
    }
  }
}