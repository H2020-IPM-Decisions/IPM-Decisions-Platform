import { Component, Input, OnInit } from "@angular/core";
import CodesJson from './vocabulary.json';

@Component({
    selector: "eppo-code-badge",
    templateUrl: "./eppo-code-badge.component.html",
    styleUrls: ["./eppo-code-badge.component.css"]
})
export class EppoCodeBadgeComponent implements OnInit {

    @Input() 
    code: string;
    @Input() 
    dss: string;
    @Input()
    status: number;
    description: string = '';

    constructor( ) { }

    ngOnInit(): void {
        if(CodesJson.cropEppoCode[this.code]){
            this.description = CodesJson.cropEppoCode[this.code];
        }
    }

}