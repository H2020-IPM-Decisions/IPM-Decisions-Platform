import { AfterViewInit, Component, ElementRef, Input, ViewChild, SimpleChanges } from "@angular/core";
import { IChartDataset } from "./custom-chart.model";
import { CustomChartService } from "./custom-chart.service";
import { IDssResultFlat } from "../dss-selection.model";
import Chart from 'chart.js/auto';

@Component({
    selector: "custom-group-chart",
    templateUrl: "./custom-group-chart.component.html",
    styleUrls: ["./custom-group-chart.component.css"]
})
export class CustomGroupChartComponent implements AfterViewInit {
    @Input()
    chartId: string;
    @Input() 
    chartResultParameters!: IDssResultFlat[]
    @Input()
    isAPopUpChart: boolean;

    data: number[] = [];
    labels: string[] = [];
    
    @ViewChild('chart') el:ElementRef;
    @ViewChild('yaxis') ax:ElementRef;

    errorMessage: string;
    chartElement: Chart;
    borderColors: string[] = [];

    chartDatasets: IChartDataset[] = [];

    constructor(private customChartService: CustomChartService){}

    ngAfterViewInit(): void {
        this.initChartData();
        if(this.isAPopUpChart){
            this.chartElement = this.customChartService.drawGroupChartWhitFixedYAxis(this.el.nativeElement, this.ax.nativeElement, this.labels, this.chartDatasets);
        }else{
            this.chartElement = this.customChartService.drawGroupChart(this.el.nativeElement, this.labels, this.chartDatasets);
        }
        
    }

    initChartData(): void{
        this.data = this.chartResultParameters[0].data;
        this.labels = this.chartResultParameters[0].labels;
        this.chartResultParameters.forEach(chartResult => {
            if(chartResult.chartInformation && !chartResult.chartInformation.defaultVisible){
                return;
            }
            let legend = '';
            if(chartResult.chartInformation && chartResult.chartInformation.unit){
                var element = document.createElement('div');
                element.innerHTML = chartResult.chartInformation.unit;
                const str = element.textContent;
                legend = str;
            }
            let type = '';
            if(chartResult.chartInformation && chartResult.chartInformation.chartType){
                type = chartResult.chartInformation.chartType;
            }

            this.chartDatasets.push(this.customChartService.initChartDataset(
                chartResult.data,
                chartResult.chartInformation.chartType,
                legend,
                chartResult.chartInformation.color
                )
            )
        });
        if(this.data.length != this.labels.length){
            this.errorMessage = 'Error with graph data and labels (length different)';
            return;
        }
    }

    resetZoom() {
        let mychart = this.customChartService.getChart(this.chartId);
        mychart.resetZoom('active');
    }

    isZoomedOrPanned(): boolean {
        let isZorP = false;
        let mychart = this.customChartService.getChart(this.chartId);
        if (mychart && mychart.isZoomedOrPanned()) {
          isZorP = true;
        }
        return isZorP;
    }
}