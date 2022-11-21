import { IDssFlat } from './../dss/dss-selection.model';
import { Component, Input, TemplateRef, OnInit } from "@angular/core";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NavigationExtras, Router } from '@angular/router';
import { TranslationService } from '@app/shared/services/translation.service';
import * as moment from "moment";
import * as $ from "jquery";

@Component({
    selector: "eppo-code-badge",
    templateUrl: "./eppo-code-badge.component.html",
    styleUrls: ["./eppo-code-badge.component.css"]
})
export class EppoCodeBadgeComponent {

    /*
    Traffic light' status of the model prediction. 
    It can have 5 different values: 
        0 = Status gives no meaning (e.g. outside of season or before biofix), --> GREY
        1 = Cannot give status due to error, e.g. missing data, --> GREY
        2 = No risk of infection, --> GREEN
        3 = Medium risk of infection, --> ORANGE
        4 = High risk of infection. --> RED
        How to interpret these risks is unique to each model, and must be explained in the DSS catalogue metadata property output.
    */

    @Input()
    dssDetail?: IDssFlat;
    @Input()
    itemId?: string;
    @Input()
    endpoint?: string;
    @Input()
    code?: string;
    @Input() 
    dss?: string;
    @Input()
    status?: number;
    @Input()
    statusRepresentation?: string;
    @Input()
    executionType?: string;
    @Input()
    dssDescription?: string;
    @Input()
    errorType?: number;
    @Input()
    errorMessage?: string;
    @Input()
    isLegend?: boolean;
    @Input()
    isQueued?: boolean;
    @Input()
    isScheduled?: boolean;
    @Input()
    scheduleTime?: string;
    @Input()
    isValid?: boolean;

    modalRef: BsModalRef;
    usedLanguage: string;

    constructor(
        private _modalService: BsModalService,
        private _router: Router,
        private _translationService: TranslationService
        ) {}
    
    public ngOnInit(): void {
      this.usedLanguage = this._translationService.convertLangToMomentCode(sessionStorage.getItem("selectedLanguage"));
      moment.locale(this.usedLanguage);
      if (this.isScheduled) {
        this.scheduleTime = moment(this.scheduleTime).format('Do MMMM YYYY, h:mm:ss a');
      }
    }

    openModal(template: TemplateRef<any>, size?: string) {
        this.modalRef = this._modalService.show(template, {class: size});
    }

    goToModelParameterisation(): void {
        const navigationExtras: NavigationExtras = { 
          state: { 
            data: {
              dssId: this.dssDetail.dssId, 
              dssModelId: this.dssDetail.dssModelId,
              dssModelName: this.dssDetail.dssModelName,
              farmName: this.dssDetail.farmName,
              farmId: this.dssDetail.farmId,
              dssDetailPage: true
            }
          }
        };
        this._router.navigate(['/user/farm',this.dssDetail.farmId,'edit','dss',this.dssDetail.id,'parameterisation'], navigationExtras);
    }

    gotErrorType(): boolean {
      if (this.errorType == 0 || this.errorType == 1 || this.errorType == 2) {
        return true;
      }
      return false;
    }
}