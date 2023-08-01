import { Injectable } from "@angular/core";
import Chart from 'chart.js/auto';
import { IChartDataset } from "./custom-chart.model";
import zoomPlugin from 'chartjs-plugin-zoom';
import { TranslationService } from "@app/shared/services/translation.service";
Chart.register(zoomPlugin);

@Injectable({ providedIn: 'root' })
export class CustomChartService {
    
    constructor(private _translation: TranslationService){}
    public drawChart(element: any, labels: string[], data: number[], type: string, legend: string, color: string|string[], options: object={}): any{
        Chart.defaults.font.size = 14;
        const colors = typeof color === 'string' ? this.getChartJsColorArray(data.length, color) : color;
        const backgroundColors = type === 'bar' ? colors : 'white';
        
        return new Chart(element, {
            type: this.getChartJsType(type),
            data: {
                labels: labels,
                datasets: [{
                    label: legend,
                    data: data,
                    borderColor: colors,
                    backgroundColor: backgroundColors,
                    tension: 0.1,
                    fill: false
                }]
            },
            options: options
        });
    }

    public drawChartWithFixedYAxis(chartElement: any, axisElement: any, labels: string[], data: number[], type: string, legend: string, color: string, options: object): any {
        Chart.defaults.font.size = 14;
        const colors = typeof color === 'string' ? this.getChartJsColorArray(data.length, color) : color;
        const backgroundColors = type === 'bar' ? colors : 'white';

        let newOptions = this.getOptionsForFixedYAxis(options, chartElement, axisElement)
        
        return new Chart(chartElement, {
            type: this.getChartJsType(type),
            data: {
                labels: labels,
                datasets: [{
                    label: legend,
                    data: data,
                    borderColor: colors,
                    backgroundColor: backgroundColors,
                    tension: 0.1,
                    fill: false
                }]
            },
            options: newOptions
        });
    }

    private getOptionsForFixedYAxis(options: object, chartElement: any, axisElement: any) {

        let newOptions: object = JSON.parse(JSON.stringify(options));

        const lowLabel: string = this._translation.getTranslatedMessage("Common_labels.Low");
        const mediumLabel: string = this._translation.getTranslatedMessage("Common_labels.Medium");
        const highLabel: string = this._translation.getTranslatedMessage("Common_labels.High");

    

        newOptions["plugins"].zoom = {
            zoom: {
              wheel: {
                enabled: false
              },
              pinch: {
                enabled: false
              },
              mode: 'x'
            },
            pan: {
              enabled: false,
              mode: 'x',
              threshold: 5
            }
        };

        newOptions["plugins"].tooltip = {
            callbacks: {
                label: function(tooltipItem){
                    var label = tooltipItem.dataset.label;
                    var value = tooltipItem.dataset.data[tooltipItem.dataIndex];
                    switch (value) {
                        case 2:
                            return label + ": "+lowLabel;
                        case 3:
                            return label + ": "+mediumLabel;
                        case 4:
                            return label + ": "+highLabel;
                    } 
                }
            }
        }

        newOptions["scales"]['x'] = {
            min: 0
        };

        newOptions["scales"]["y"] = {
            min: 1,
                max: 4,
                beginAtZero: false,
                stepSize: 1,
                ticks: {
                    callback: function(label, index, labels) {
                        switch (label) {
                            case 2:
                              return lowLabel;
                            case 3:
                              return mediumLabel;
                            case 4:
                              return highLabel;
                        }
                    }
                }
        }
        
        const sourceCanvas = chartElement;
        const sourceCtx = sourceCanvas.getContext('2d');
        const targetCanvas = axisElement;
        const targetCtx = targetCanvas.getContext('2d');
        
        newOptions["animation"] = {
              onComplete: function() {
                if (!this.rectangleSet) {
                  const scale = window.devicePixelRatio;
                  const copyWidth = this.scales['y'].width - 10;
                  const copyHeight = this.scales['y'].height + this.scales['y'].top + 10;
                 
                  targetCtx.scale(scale, scale);
                  targetCtx.canvas.width = copyWidth * scale;
                  targetCtx.canvas.height = copyHeight * scale;
                  targetCtx.canvas.style.width = copyWidth + 'px';
                  targetCtx.canvas.style.height = copyHeight + 'px';
                  targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0,copyWidth * scale, copyHeight * scale);
                  sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
                  this.rectangleSet = true;
                }
              },
              onProgress: function() {
                if (this.rectangleSet) {
                  var copyWidth = this.scales['y'].width;
                  var copyHeight = this.scales['y'].height + this.scales['y'].top + 10;
                  sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
                }
              },
        }

        return newOptions;
    }

    public drawGroupChart(element: any, labels: string[], datasets: IChartDataset[]): any{

        function freezeAxis(scale) {
            scale.options.min = scale.min;
            scale.options.max = scale.max;
        }
        
        function unfreezeAxis(scale) {
            scale.options.min = null; // or infinite value, e.g., -1/0
            scale.options.max = null;
        }

        return new Chart(element, {
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: "x",
                            onPanStart({ chart }) {
                              freezeAxis(chart.scales.y);
                            },
                            onPanComplete({ chart }) {
                              unfreezeAxis(chart.scales.y);
                            }
                          },
                          zoom: {
                            wheel: {
                              enabled: true
                            },
                            pinch: {
                              enabled: true
                            },
                            mode: "x",
                            onZoomStart({ chart }) {
                              freezeAxis(chart.scales.y);
                            },
                            onZoomComplete({ chart }) {
                              unfreezeAxis(chart.scales.y);
                            }
                        }
                      },          
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    drawGroupChartWhitFixedYAxis(chartElement: any, axisElement: any, labels: string[], datasets: IChartDataset[]): Chart {

        let options = this.getOptionsForFixedYAxisInGroupChart(chartElement, axisElement)

        return new Chart(chartElement, {
            data: {
                labels: labels,
                datasets: datasets
            },
            options: options
        });
    }


    private getOptionsForFixedYAxisInGroupChart(chartElement: any, axisElement: any) {

        let options: object = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                zoom: {
                    wheel: {
                      enabled: false
                    },
                    pinch: {
                      enabled: false
                    },
                    mode: 'x'
                  },
                  pan: {
                    enabled: false,
                    mode: 'x',
                    threshold: 5
                  },          
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    min: 0,
                    ticks:{
                        maxRotation:0
                    }
                }
            }
        };


        const sourceCanvas = chartElement;
        const sourceCtx = sourceCanvas.getContext('2d');
        const targetCanvas = axisElement;
        const targetCtx = targetCanvas.getContext('2d');
        
        options["animation"] = {
                onComplete: function() {
                if (!this.rectangleSet) {
                    const scale = window.devicePixelRatio;
                    const copyWidth = this.scales['y'].width - 3;
                    const copyHeight = this.scales['y'].height + this.scales['y'].top + 10;
                    
                    targetCtx.scale(scale, scale);
                    targetCtx.canvas.width = copyWidth * scale;
                    targetCtx.canvas.height = copyHeight * scale;
                    targetCtx.canvas.style.width = copyWidth + 'px';
                    targetCtx.canvas.style.height = copyHeight + 'px';
                    targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0,copyWidth * scale, copyHeight * scale);
                    sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
                    this.rectangleSet = true;
                }
                },
                onProgress: function() {
                if (this.rectangleSet) {
                    var copyWidth = this.scales['y'].width;
                    var copyHeight = this.scales['y'].height + this.scales['y'].top + 10;
                    sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
                }
                },
        }
        

        return options;
    }
    

    public initChartDataset(data: number[],  type: string, legend: string, color: string|string[]): IChartDataset{
        const colors = typeof color === 'string' ? this.getChartJsColorArray(data.length, color) : color;
        const backgroundColors = type === 'bar' ? colors : 'white';
        return {
            type: this.getChartJsType(type),
            data: data,
            label: legend,
            tension: 0.1,
            fill: false,
            borderColor: colors,
            backgroundColor: backgroundColors
        }
        

    }

    private getChartJsColorArray(size: number, color?: string): string[]{
        if(!size) return [];
        let borderColors: string[] = [];
        for(let i=0;i<size;i++){
            if(!color)
                borderColors.push('rgb('+Math.floor(Math.random()*255)+', '+Math.floor(Math.random()*255)+', '+Math.floor(Math.random()*255)+')');
            else
                borderColors.push(color);
        }
        return borderColors;
    }

    private getChartJsType(type?: string){
        if(!type || type === 'spline') return 'line';
        return type;
    }

    getChart(id: string): Chart{
        let myChart = Chart.getChart(id);
        return myChart;
    }
}