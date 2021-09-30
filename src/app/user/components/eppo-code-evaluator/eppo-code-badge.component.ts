import { Component, Input } from "@angular/core";

@Component({
    selector: "eppo-code-badge",
    templateUrl: "./eppo-code-badge.component.html",
    styleUrls: ["./eppo-code-badge.component.css"]
})
export class EppoCodeBadgeComponent {

    /*
    Traffic light' status of the model prediction. 
    It can have 5 different values: 
        0 = Status gives no meaning (e.g. outside of season or before biofix), --> GREY
        1 = Cannot give status due to error, e.g. missing data, --> GREY
        2 = No risk of infection, --> GREEN
        3 = Medium risk of infection, --> ORANGE
        4 = High risk of infection. --> RED
        How to interpret these risks is unique to each model, and must be explained in the DSS catalogue metadata property output.
    */

    @Input() 
    code: string;
    @Input() 
    dss: string;
    @Input()
    status: number;
    @Input()
    statusRepresentation: string;
    @Input()
    executionType: string;
    
    constructor( ) { }

}