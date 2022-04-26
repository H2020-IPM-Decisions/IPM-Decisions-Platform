import { Component, Input, Output, OnInit} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-multi-select',
    templateUrl: './multi-select.component.html',
    styleUrls: ['./multi-select.component.css']
})

export class MultiSelectComponent implements OnInit {

    @Input() public textToShow!: String;
    @Input() public valueContent!: any;
    @Input() public maxSelectableOptions!: number;
    @Input() public currentSelected!: number;
    @Output() public select: EventEmitter<any> = new EventEmitter();
    @Output() public deselect: EventEmitter<any> = new EventEmitter();
    public isSelected: boolean = false;

    constructor () {}

    public ngOnInit(): void {}

    public onSelect(): void {
        if(this.currentSelected < this.maxSelectableOptions) {
            this.isSelected = !this.isSelected;
            this.select.emit(this.valueContent);
        }
    }

    public onDeselect(): void {
        this.isSelected = !this.isSelected;
        this.deselect.emit(this.valueContent);
    }
}
