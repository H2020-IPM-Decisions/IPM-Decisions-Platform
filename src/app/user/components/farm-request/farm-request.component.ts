import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { ToastrTranslationService } from '@app/shared/services/toastr-translation.service';
import { UserProfileService } from '@app/shared/services/upr/user-profile.service';

@Component({
  selector: '[farm-request]',
  templateUrl: './farm-request.component.html',
  styleUrls: ['./farm-request.component.css']
})
export class FarmRequestComponent implements OnInit {


  public email: string;

  @Output() Close: EventEmitter<string> = new EventEmitter();

  constructor(
    private _userProfileService: UserProfileService,
    private _toastrTranslated: ToastrTranslationService,
  ) { }

  @ViewChild('farmRequestModal') public farmRequestModal: TemplateRef<any>;
  modalRef: any;

  sendRequest() {
    this._userProfileService.sendFarmShareRequest(this.email).subscribe(
      (response: HttpResponse<any>) => {
        this._toastrTranslated.showTranslatedToastr("Information_messages.Farm_share_request_sent","Common_labels.Success","toast-success");
        this.Close.emit();
      },
      (error: HttpErrorResponse) => {
          console.log(error.message);
          this._toastrTranslated.showTranslatedToastr("Error_messages.Farm_share_request_error","Common_labels.Error","toast-error");
      }
    );
  }

  ngOnInit() {
  }

}
