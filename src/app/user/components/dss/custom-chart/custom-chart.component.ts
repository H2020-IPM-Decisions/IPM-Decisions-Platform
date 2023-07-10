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
    isAPopUpChart: boolean;
    @Input()
    animation!: boolean;
    
    @ViewChild('chart') el:ElementRef;
    @ViewChild('chart_popup') el_popup:ElementRef;
    @ViewChild('yaxis') ax:ElementRef;

    errorMessage: string;
    chartPopupElement: any;
    chartElement: any;
    borderColors: string[] = [];

    constructor(private customChartService: CustomChartService)
    {}
    
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

        if(this.isAPopUpChart){
            /*
            var chartArea = document.querySelector<HTMLElement>('.chartArea');
            // With 7 days
            //chartArea.style.width = 200 * 7 + "px";
            // With 30 days
            //chartArea.style.width = 75 * 30 + "px";
            // Testing dimensions
            chartArea.style.width = 200 * 30 + "px";
            */
            this.chartPopupElement = this.customChartService.drawChartWithFixedYAxis(this.el_popup.nativeElement, this.ax.nativeElement, this.labels, this.data, type, legend, color, options);
        }else{
            this.chartElement = this.customChartService.drawChart(this.el.nativeElement, this.labels, this.data, type, legend, color, options);
        }
        
        /*
        function scroller(scroll, myChart) {
            
            const chartXAxisLenght = myChart.data.labels.length;

            if(scroll.deltaY > 0){
                if(myChart.config.options.scales.x.max >= chartXAxisLenght){    
                    myChart.config.options.scales.x.min = chartXAxisLenght - 4;
                    myChart.config.options.scales.x.max = chartXAxisLenght;
                }else{
                    myChart.config.options.scales.x.min +=1;
                    myChart.config.options.scales.x.max +=1;
                }
                
            } else if(scroll.deltaY < 0){
                if(myChart.config.options.scales.x.min <= 0){
                    myChart.config.options.scales.x.min = 0;
                    myChart.config.options.scales.x.max = 3;
                }else{
                    myChart.config.options.scales.x.min -=1;
                    myChart.config.options.scales.x.max -=1;
                }
                
            }

            myChart.update();
        }

        this.chartElement.canvas.addEventListener('wheel', (e) => {
            scroller(e, this.chartElement);
            console.log("X MIN:" + this.chartElement.config.options.scales.x.min)
        });
        */
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