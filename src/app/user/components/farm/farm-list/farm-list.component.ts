import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FarmModel } from "@app/shared/models/farm.model";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-farm-list",
  templateUrl: "./farm-list.component.html",
  styleUrls: ["./farm-list.component.css"],
})
export class FarmListComponent implements OnInit {
  farmList: FarmModel[] = [];
  modalRef: BsModalRef;

  constructor(
    private _farmService: FarmService,
    private _modalService: BsModalService
  ) {}

  ngOnInit() {
    // get farms from api
    this.getFarms();
  }

  copyFarm() {
    let farm = {
      name: "Heart and Soil Farm [Copy]",
      inf1: "Address 1",
    };
    console.log("farm clicked", farm);
    const modFarm = (farm["id"] = undefined);
    console.log("mdo", modFarm);
    // this.farmList.push(farm);
  }

  getFarms() {
    this._farmService.getFarms().subscribe((farms: any) => {
      console.log("farms", farms);
      if (farms.status !== 404 && farms.value.length > 0) {
        this.farmList = farms.value;
      }
    });
  }

  openModal(template) {
    this.modalRef = this._modalService.show(template);
  }

  deleteFarmConfirm(farmId) {
    if (farmId) {
      this._farmService
        .deleteFarmById(farmId)
        .subscribe((response: HttpResponse<any>) => {
          if (response.status === 204) {
            this._modalService.hide(1);
            
            const index: number = this.farmList.findIndex(
              (item) => item.id === farmId
            );

            if (index !== -1) {
              this.farmList.splice(index, 1);
            }
          }
        });
    }
  }
}
