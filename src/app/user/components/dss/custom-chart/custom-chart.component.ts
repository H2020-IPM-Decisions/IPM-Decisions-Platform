import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import Chart from 'chart.js/auto';

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
    header: string;
    
    @ViewChild('chart', {static: false}) 
    el:ElementRef;

    errorMessage: string;
    chartElement: Chart;
    borderColors: string[] = [];

    constructor(){
        
    }
    
    ngAfterViewInit(): void {
        if(this.data.length != this.labels.length){
            this.errorMessage = 'Error with graph data and labels (length different)';
            return;
        }
        for(let i=0;i<this.data.length;i++){
            this.borderColors.push('rgb('+Math.floor(Math.random()*255)+', '+Math.floor(Math.random()*255)+', '+Math.floor(Math.random()*255)+')');
        }
        this.chartElement = new Chart(this.el.nativeElement, {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: [{
                    label: this.header,
                    data: this.data,
                    borderColor: this.borderColors,
                    tension: 0.1,
                    fill: false
                }]
            }
        });
    }

}