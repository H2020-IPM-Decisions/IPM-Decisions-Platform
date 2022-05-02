export interface IChartConfig{
    defaultVisible?: boolean;
    unit?: string;
    chartType?: string;
    color?: string;
    options?:any;
}

export interface IChartDataset{
    label?: string;
    data?: number[];
    borderColor?: string|string[];
    backgroundColor?: string|string[];
    tension?: number;
    fill?: boolean;
    type?: string;
}