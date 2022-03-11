import { IDssFlat } from './../dss/dss-selection.model';
import { Component, Input, TemplateRef } from "@angular/core";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NavigationExtras, Router } from '@angular/router';

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
    code: string;
    @Input() 
    dss: string;
    @Input()
    status: number;
    @Input()
    statusRepresentation: string;
    @Input()
    executionType: string;
    @Input()
    dssDescription: string;
    @Input()
    isValid?: boolean;
    @Input()
    errorMessage?: string;
    @Input()
    isLegend?: boolean;

    modalRef: BsModalRef;
    
    constructor(
        private _modalService: BsModalService,
        private _router: Router
        ) { }

    openModal(template: TemplateRef<any>, size?: string) {
        this.modalRef = this._modalService.show(template, {class: size});
    }

    goToModelParametrisation(): void {
        const navigationExtras: NavigationExtras = { 
          state: { 
            data: {
              dssId: this.dssDetail.dssId, 
              dssModelId: this.dssDetail.dssModelId,
              dssModelName: this.dssDetail.dssModelName,
              farmName: this.dssDetail.farmName,
              dssDetailPage: true
            }
          }
        };
        this._router.navigate(['/user/farm',this.dssDetail.farmId,'edit','dss',this.dssDetail.id,'parametrisation'], navigationExtras);
    }
}