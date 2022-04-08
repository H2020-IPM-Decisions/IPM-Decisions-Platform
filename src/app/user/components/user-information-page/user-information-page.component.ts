import { Component, OnInit } from "@angular/core";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
    selector: "app-user-information-page",
    templateUrl: "./user-information-page.component.html",
    styleUrls: ["./user-information-page.component.css"]
})

export class UserInformationPageComponent implements OnInit {

    constructor(
        private _toastrTranslated: ToastrTranslationService
    ) { }

    ngOnInit() {}
}