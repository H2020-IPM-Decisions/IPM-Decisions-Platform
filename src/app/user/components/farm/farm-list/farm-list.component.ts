import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FarmResponseModel } from "@app/shared/models/farm-response.model";
import { Farm } from "@app/shared/models/farm.model";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { NGXLogger } from "ngx-logger";
import {TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: "app-farm-list",
  templateUrl: "./farm-list.component.html",
  styleUrls: ["./farm-list.component.css"],
})
export class FarmListComponent implements OnInit {
  farmList: Farm[] = [];
  modalRef: BsModalRef;
  public tooltipCopy = "Common_labels.Copy"
  public tooltipEdit = "Common_labels.Edit"
  public tooltipDelete = "Common_labels.Delete"
  public subscriptionLanguage: Subscription;
  public copySuccessMsg: any;
  public copySuccessTitle: any;

  constructor(
    private _farmService: FarmService,
    private _modalService: BsModalService,
    private _toastr: ToastrService,
    private _logger: NGXLogger,
    private _translate: TranslateService
  ) {
    this.initLanguageLabels();
  }

  ngOnInit() {
    this.getFarms();
  }
  
  onFarmCopy(farm: Farm) {
    let copyFarm = {...farm};
    copyFarm.id = null;
    copyFarm.name = farm.name + " [Copy]";
    this._farmService.createFarm(copyFarm).subscribe(
      (response) => {
        if (response.ok) {
          this.farmList.push(copyFarm);
          this._toastr.show(this.copySuccessMsg, this.copySuccessTitle, null, "toast-success");
        }
      },
      (error) => {
        this._logger.error("Farm copy error:",error);
      }
    );
  }

  getFarms() {
    this._farmService.getFarms().subscribe((response: FarmResponseModel) => {
      if (response && response.value) {
        const farms = response.value;
        farms.forEach((farm) => {
          this._farmService.getAddressFromCoordinates(farm.location.y, farm.location.x).subscribe( (data) => farm.location.address = data);
        });
        this.farmList = farms;
      }
    });
  }

  openModal(template) {
    this.modalRef = this._modalService.show(template);
  }

  onDeleteFarm(farmId) {
    if (farmId) {
      this._farmService
        .deleteFarm(farmId)
        .subscribe((response: HttpResponse<any>) => {
          if (response.status === 204) {
            const index: number = this.farmList.findIndex(
              (item) => item.id === farmId
            );

            if (index !== -1) {
              this.farmList.splice(index, 1);
            }
          }
        });
    } else {
      this.farmList.splice(this.farmList.length - 1, 1);
    }
    this.modalRef.hide();
  }

  initLanguageLabels(): void {
    this.subscriptionLanguage = this._translate.get('Information_messages.Farm_copy_success').pipe(
      switchMap((copyMsgContent) => {
        this.copySuccessMsg = copyMsgContent;
        return this._translate.get('Common_labels.Success')})
    ).subscribe((copyMsgTitle)=> {
      this.copySuccessTitle = copyMsgTitle;
    });      
  }
}
