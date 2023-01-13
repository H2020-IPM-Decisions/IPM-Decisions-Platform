import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { FarmResponseModel } from "@app/shared/models/farm-response.model";
import { Farm } from "@app/shared/models/farm.model";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
  selector: "app-farm-list",
  templateUrl: "./farm-list.component.html",
  styleUrls: ["./farm-list.component.css"],
})
export class FarmListComponent implements OnInit {
  farmList: Farm[] = [];
  modalRef: BsModalRef;

  constructor(
    private _farmService: FarmService,
    private _modalService: BsModalService,
    private _logger: NGXLogger,
    private _toastrTranslated: ToastrTranslationService,
    private _router: Router
  ) {}

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
          //this.farmList.push(copyFarm);
          this._toastrTranslated.showTranslatedToastr("Information_messages.Farm_copy_success","Common_labels.Success","toast-success");
          this.getFarms();
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

  goToAddModelDSS(farmId) {
    this._router.navigate(['/user/farm',farmId,'edit','dss','add']);
  }
}
