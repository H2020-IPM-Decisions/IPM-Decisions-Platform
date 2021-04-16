import { HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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
    private _modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getFarms();
  }

  onFarmCopy(farm: Farm) {
    this.copiedFarm = true;
    let copyFarm = {} as Farm;
    copyFarm.id = null;
    copyFarm.name = farm.name + " [Copy]";
    //copyFarm.weatherStationDto = farm.weatherStationDto;
    //copyFarm.weatherDataSourceDto = farm.weatherDataSourceDto;
    copyFarm.location = farm.location;
    this._farmService.createFarm(copyFarm).subscribe(
      (response) => {
        if (response.ok) {
          this.farmList.push(copyFarm);
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
          this.convertLatLngToAddress(farm);
        });
        this.farmList = farms;
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
        if (result) {
          /*farm.location.address = {
            address: result.address.Address,
            city: result.address.City,
            postal: result.address.Postal,
            countryCode: result.address.CountryCode,
            region: result.address.Region,
            shortLabel: result.address.ShortLabel,
            longLabel: result.address.LongLabel,
          };*/
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
