import { Injectable } from "@angular/core";
import Chart from 'chart.js/auto';
import { IChartDataset } from "./custom-chart.model";

@Injectable({ providedIn: 'root' })
export class CustomChartService {
    constructor(){}
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

    /*public drawChart(element: any, labels: string[], data: number[], type: string, legend: string, color: string|string[]): any{
        let chartDatasets: IChartDataset[] = [];
        chartDatasets.push(this.initChartDataset(data,type,legend,color))
        return new Chart(element, {
            type: this.getChartJsType(type),
            data: {
                labels: labels,
                datasets: chartDatasets
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }*/

    public drawGroupChart(element: any, labels: string[], datasets: IChartDataset[]): any{
        return new Chart(element, {
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
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
}