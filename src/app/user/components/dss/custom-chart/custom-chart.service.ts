import { Injectable } from "@angular/core";
import Chart from 'chart.js/auto';

@Injectable({ providedIn: 'root' })
export class CustomChartService {
    constructor(){}
    public drawChart(element: any, labels: string[], data: number[], type: string, legend: string, color: string|string[], maxDataValue?: number): any{
        const colors = typeof color === 'string' ? this.getChartJsColorArray(data.length, color) : color;
        const backgroundColors = type === 'bar' ? colors : 'white';
        const options = maxDataValue ? {scales: { y: { max: maxDataValue } } } : {};

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