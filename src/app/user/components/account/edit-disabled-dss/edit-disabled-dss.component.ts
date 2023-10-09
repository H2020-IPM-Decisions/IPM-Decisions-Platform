import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AuthenticationService } from "@app/core/auth/services/authentication.service";
import { FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NGXLogger } from "ngx-logger";
import { Subscription } from 'rxjs';
import { IDSSDisabled } from "./edit-disabled-dss.model";
import { DssSelectionService } from "../../dss/dss-selection.service";
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
    selector: "app-edit-password",
    templateUrl: "./edit-disabled-dss.component.html",
    styleUrls: ["./edit-disabled-dss.component.css"],
})
export class DisabledDSSComponent implements OnInit {

    public $subscriptionSubmit: Subscription;

    userRole = {description: "", value: ""};
    public changePasswordForm: FormGroup;
    public submitted: boolean = false;
    public user_id: string;
    public email: string;
    public modalRef: BsModalRef;
    public errorDescription: string;
    public data: IDSSDisabled [] = [];
    sortHeaderIndex: number = -1;

    @ViewChild('changePasswordModal') public changePasswordModal: TemplateRef<any>;

    constructor(
    public authService: AuthenticationService,
    private _logger: NGXLogger,
    private _dssSelectionService: DssSelectionService,
    private _toastrTranslated: ToastrTranslationService,
    ) {}

    ngOnInit(): void {
      this.user_id = this.authService.currentUserValue.id;
      this._dssSelectionService.getDssListForDisablingManagement().subscribe(

        (response: HttpResponse<IDSSDisabled[]>) => {

            this.data = response.body;
            if(this.data.length == 0){
              this._toastrTranslated.showTranslatedToastr("Warning_messages.DSS_model_availability_error",
                                                          "Common_labels.Warning",
                                                          "toast-warning");
            }

        },
        (error: HttpErrorResponse) => {

            this._logger.error("Dss models selection error",error);
            this._toastrTranslated.showTranslatedToastr("Error_messages.DSS_model_retrived_error",
                                                        "Common_labels.Error",
                                                        "toast-error");
        }

      );
    }

    public sortTable(columnIndex: number) {
      var table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("disabledDssTable");
      switching = true;
      this.sortHeaderIndex = columnIndex;
      /*Make a loop that will continue until
      no switching has been done:*/
      while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
          //start by saying there should be no switching:
          shouldSwitch = false;
          /*Get the two elements you want to compare,
          one from current row and one from the next:*/
          x = rows[i].getElementsByTagName("TD")[columnIndex];
          y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
          //check if the two rows should switch place:
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          /*If a switch has been marked, make the switch
          and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
    }
}

