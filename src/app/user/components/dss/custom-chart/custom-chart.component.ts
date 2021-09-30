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
    
    @ViewChild('chart', {static: false}) 
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
        this.chartElement = this.customChartService.drawChart(this.el.nativeElement, this.labels, this.data, type, legend, color);
    }

}