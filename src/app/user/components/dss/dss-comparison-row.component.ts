import { Component, Input, OnInit, TemplateRef} from '@angular/core';
import { IDssFlat, IDssChartGroup, IDssResultChart } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-dss-comparison-row',
    templateUrl: './dss-comparison-row.component.html',
    styleUrls: ['./dss-comparison-row.component.css'],
  })
export class DssComparisonRowComponent implements OnInit {

    @Input() public dssDetail!: IDssFlat;

    warning: {data:number[],labels:string[],chartInformation:IDssResultChart};
    dssChartGroups: IDssChartGroup[] = [];
    selectedDssChartGroup: IDssChartGroup;
    modalRef: BsModalRef;

    constructor(
        private service: DssSelectionService,
        private _logger: NGXLogger,
        private _toastrTranslated: ToastrTranslationService,
        private _modalService: BsModalService,
    ) { }

    ngOnInit(): void {
        this.dssChartGroups = this.dssDetail.chartGroups;
	    this.selectedDssChartGroup = this.dssChartGroups[0];
        if(this.dssDetail.warningStatusPerDay){
		    this.warning = this.service.getDssWarningChart(this.dssDetail.warningStatusPerDay, this.dssDetail.warningStatusLabels);
	    }
    }

    onChangeChartGroup(selectedChart){
        this.selectedDssChartGroup = selectedChart
    }

    openModal(template: TemplateRef<any>, size?: string) {
        this.modalRef = this._modalService.show(template, {class: size});
    }

}