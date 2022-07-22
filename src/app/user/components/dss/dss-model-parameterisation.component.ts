import { DssParameters, IDssParameters } from './dss-selection.model';
import { DssSelectionService } from './dss-selection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NGXLogger } from 'ngx-logger';
import { JsonEditorService } from './json-editor/json-editor.service';
import { Subscription } from 'rxjs';
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import * as $ from 'jquery';
import * as moment from "moment";

@Component({
  selector: "app-dss-model-parameterisation",
  templateUrl: "./dss-model-parameterisation.component.html",
  styleUrls: ["./dss-model-parameterisation.component.css"],
})

export class DssModelParameterisationComponent implements OnInit, OnDestroy {
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
  public defaultDssParameters: string;

  public $subscriptionEditor: Subscription;
  public $subscriptionSubmit: Subscription;
  public $subscriptionDefaultParameters: Subscription;
  //public $subscriptionParameters: Subscription;

  constructor(
    private _logger: NGXLogger,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dssSelectionService: DssSelectionService,
    private _jsonEditorService: JsonEditorService,
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
      this._dssSelectionService.getSchemaByDssId(this.id).subscribe((data) => {
        if (this.editor) {
          this._jsonEditorService.reset(this.editor);
        }
        if (this.$subscriptionEditor) {
          this.$subscriptionEditor.unsubscribe();
        }
        this.remoteCallLoading = false;
        //console.log("DATA:",data.body)
        this.editor = this._jsonEditorService.createJsonEditor('json-editor-form', data.body);
        $('#json-editor-form label').filter(function () { return $(this).text() === 'root'; }).css("display", "none");
        this.$subscriptionEditor = this._jsonEditorService.listenChanges(this.editor).subscribe(() => this.editorChanges());
        
        /* Change JSON Editor date format
        $("input[type=date]").on("change", function() {
          this.setAttribute("data-date", moment(this.value, "YYYY-MM-DD").format("YYYY-MM-DD"));
        }).trigger("change")*/
        
        /*$(function(){ 
          var label_text = $('label').text();
          $('label').text( label_text.replace("(YYYY-MM-DD)", "") );
        });*/
        /*$(document).ready(function(){
          $("label").text(this.text().replace("(YYYY-MM-DD)", ""));
        });*/
        
        /* REMOVE Date format from labels*/
        var ancestor = document.getElementById('paramForm');
        var descendents = ancestor.getElementsByTagName('*');
        var e: any;
        for (let i = 0; i < descendents.length; ++i) {
          e = descendents.item(i);
          /*if(e.getAttribute("type") === "date") {
            $("input").on("change", function() {
              this.setAttribute("data-date", moment(this.value, "YYYY-MM-DD").format("YYYY-MM-DD"));
            }).trigger("change")
            //console.log(e.getAttribute("data-date"));
            //e.value = moment(e.value, "YYYY-MM-DD").format("YYYY-MM-DD");
          }*/
          if(e.nodeName === "LABEL") {
            var labelText:string = e.innerText;
            e.innerText = labelText.replace("(YYYY-MM-DD)", "");
          }
          // DISABLE ALL FIELDS
          /*$("input").each(function () {
            $(this).attr('disabled', 'disabled');
          });*/
        }

      }, () => {
        this.remoteCallLoading = false;
      });

      if (this.$subscriptionDefaultParameters) {
        this.$subscriptionDefaultParameters.unsubscribe();
      }
      this.$subscriptionDefaultParameters = this._dssSelectionService.getDefaultParameters(this.id).subscribe((data) => {
        this.defaultDssParameters = data.body
      });
    } catch (error) {
      this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_parameters_fetching_error","Common_labels.Error","toast-error");
      this._logger.error('Unable to fetch data:', error);
      throw new Error('Unable to fetch data');
    }

    /*if (this.$subscriptionParameters) {
      this.$subscriptionParameters.unsubscribe();
    }

    this.$subscriptionParameters = this._dssSelectionService.getDssParameters(this.id).subscribe((parameters: IDssParameters) => {
      this.dssParameters = parameters.dssParameters;
      this._logger.debug(this.dssParameters);
    });*/
  }

  public ngOnDestroy(): void {
    if (this.$subscriptionEditor) {
      this.$subscriptionEditor.unsubscribe();
    }
    if (this.$subscriptionSubmit) {
      this.$subscriptionSubmit.unsubscribe();
    }
    if (this.$subscriptionDefaultParameters) {
      this.$subscriptionDefaultParameters.unsubscribe();
    }
    /*if (this.$subscriptionParameters) {
      this.$subscriptionParameters.unsubscribe();
    }*/
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
            //setTimeout(() => this.goBack(), 5000);
            this.goBack();
          }
          
          
        },
        (error) => {
          this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_parameters_update_error","Common_labels.Error","toast-error");
          this._logger.error("Operation Failed:",error);
        }
      )
    }
  }

  public onResetToDefault(): void {
      let inputParams: DssParameters = new DssParameters(JSON.stringify(this.defaultDssParameters));
      this.$subscriptionSubmit = this._dssSelectionService.updateDssParameters(this.id, inputParams).subscribe(
        (response) => {
          if (response) {
            this._toastrTranslated.showTranslatedToastr("Information_messages.DSS_parameters_reset","Common_labels.Success","toast-success");
            //setTimeout(() => this.goBack(), 5000);
            //this.goBack();
            location.reload();
          } 
        },
        (error) => {
          this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_parameters_reset_error","Common_labels.Error","toast-error");
          this._logger.error("Operation Failed:",error);
        }
      );
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
    sessionStorage.setItem("ParameterisationData",JSON.stringify(this.historyStateData));
    sessionStorage.setItem("ParameterisationId", this.id);
    window.onbeforeunload = function(){
      sessionStorage.setItem("origin", window.location.href);
    }
  }
  private loadSessionStorageItems(): void {
    this.historyStateData = JSON.parse(sessionStorage.getItem("ParameterisationData"));
    this.id = sessionStorage.getItem("ParameterisationId");
    this.fillDataProperties();
  }
  private deleteSessionStorageItems(): void {
    sessionStorage.removeItem("ParameterisationId");
    sessionStorage.removeItem("ParameterisationData");
    if (sessionStorage.getItem("origin")) {
      sessionStorage.removeItem("origin");
    }
  }
}