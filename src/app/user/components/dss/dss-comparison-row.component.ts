import { Component, Input, OnInit} from '@angular/core';
import { IDssFlat, IDssChartGroup, IDssResultChart } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

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

    constructor(
        private service: DssSelectionService,
        private _logger: NGXLogger,
        private _toastrTranslated: ToastrTranslationService
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

}