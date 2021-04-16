import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FarmResponseModel } from "@app/shared/models/farm-response.model";
import { Farm } from "@app/shared/models/farm.model";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";

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
    private _toastr: ToastrService
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
          this.farmList.push(copyFarm);
          this._toastr.show("Farm successfully copied!", "Success!", null, "toast-success");
        }
      },
      (error) => {
        console.log("error", error);
      }
    );
  }

  getFarms() {
    this._farmService.getFarms().subscribe((response: FarmResponseModel) => {
      if (response && response.value) {
        const farms = response.value;
        farms.forEach((farm) => {
          this._farmService.getAddressFromCoordinates(farm.location.x, farm.location.y).subscribe( (data) => farm.location.address = data);
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
    this._modalService.hide(1);
  }
}
