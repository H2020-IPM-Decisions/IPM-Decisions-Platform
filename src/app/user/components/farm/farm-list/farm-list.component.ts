import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FarmResponseModel } from "@app/shared/models/farm-response.model";
import { Farm } from "@app/shared/models/farm.model";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import * as esriGeo from "esri-leaflet-geocoder";

@Component({
  selector: "app-farm-list",
  templateUrl: "./farm-list.component.html",
  styleUrls: ["./farm-list.component.css"],
})
export class FarmListComponent implements OnInit {
  farmList: Farm[] = [];
  modalRef: BsModalRef;
  copiedFarm: boolean;

  constructor(
    private _farmService: FarmService,
    private _modalService: BsModalService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.getFarms();
  }

  onFarmCopy(farm: Farm) {
    console.log("farm clicked", farm);
    this.copiedFarm = true;
    var copyFarm = {} as Farm;
    copyFarm.id = null;
    copyFarm.name = farm.name + " [Copy]";
    copyFarm.inf1 = farm.inf1;
    copyFarm.inf2 = farm.inf2;
    copyFarm.location = farm.location
    this._farmService
      .createFarm(copyFarm)
      .subscribe(
        (response) => {
          alert(JSON.stringify(response));
          this.farmList.push(copyFarm);
        },
        (error) => { alert(JSON.stringify(error))}
      )
  }

  getFarms() {
    this._farmService
      .getFarms()
      .subscribe((farmResponse: FarmResponseModel) => {
        if (farmResponse) {
          if (farmResponse.value) {
            const farms = farmResponse.value;
            farms.forEach((item) => {
              this.convertLatLngToAddress(item);
            });
            this.farmList = farms;
          }
        }
      });
  }

  private convertLatLngToAddress(farm: Farm) {
    esriGeo
      .geocodeService()
      .reverse()
      .latlng({ lat: farm.location.x, lng: farm.location.y })
      .run(function (error, result) {
        if (error) {
          return;
        }
        console.log("adresa mapa", result);
        if (result) {
          farm.location.address = {
            address: result.address.Address,
            city: result.address.City,
            postal: result.address.Postal,
            countryCode: result.address.CountryCode,
            region: result.address.Region,
            shortLabel: result.address.ShortLabel,
            longLabel: result.address.LongLabel,
          };
        }
      });
  }

  onEditFarm(selectedFarm) {
    this._farmService.setCurrentFarm(selectedFarm);
    this._router.navigate(["/user/farm/edit"]);
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
