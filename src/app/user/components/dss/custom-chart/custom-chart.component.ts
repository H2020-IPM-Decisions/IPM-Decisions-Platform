import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { IChartConfig } from "./custom-chart.model";
import { CustomChartService } from "./custom-chart.service";

@Component({
    selector: "custom-chart",
    templateUrl: "./custom-chart.component.html",
    styleUrls: ["./custom-chart.component.css"]
})
export class CustomChartComponent implements AfterViewInit {

    @Input() 
    data: number[];
    @Input()
    labels: string[];
    @Input()
    config: IChartConfig;
    @Input()
    chartId: string;
    @Input()
    animation!: boolean;
    
    @ViewChild('chart') 
    el:ElementRef;

    errorMessage: string;
    chartElement: any;
    borderColors: string[] = [];

    constructor(private customChartService: CustomChartService){}
    
    ngAfterViewInit(): void {
        if(this.config && !this.config.defaultVisible){
            return;
        }
        if(this.data.length != this.labels.length){
            this.errorMessage = 'Error with graph data and labels (length different)';
            return;
        }
        let color = '';
        if(this.config && this.config.color){
            color = this.config.color;
        }
        let legend = '';
        if(this.config && this.config.unit){
            var element = document.createElement('div');
            element.innerHTML = this.config.unit;
            const str = element.textContent;
            legend = str;
        }
        let type = '';
        if(this.config && this.config.chartType){
            type = this.config.chartType;
        }
        let options: object = {};
        if(this.config && this.config.options) {
            this.config.options.animation = this.animation
            options = this.config.options
        }
        this.chartElement = this.customChartService.drawChart(this.el.nativeElement, this.labels, this.data, type, legend, color, options);
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