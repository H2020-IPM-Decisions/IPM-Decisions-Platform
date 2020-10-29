import { Component, OnInit } from "@angular/core";
import { FarmModel } from "@app/shared/models/farm.model";
import { FarmService } from "@app/shared/services/upr/farm.service";

@Component({
  selector: "app-farm-list",
  templateUrl: "./farm-list.component.html",
  styleUrls: ["./farm-list.component.css"],
})
export class FarmListComponent implements OnInit {
  farmList: FarmModel[] = [];

  constructor(private _farmService: FarmService) {}

  ngOnInit() {
    // get farms from api
    // this.getFarms();

  }

  copyFarm() {

    let farm  = {
      name: "Heart and Soil Farm Copy",
      inf1: "Address 1" 
    }
    console.log('farm clicked', farm);
    const modFarm = farm['id'] = undefined;
    console.log('mdo', modFarm);
    this.farmList.push(farm);
  }

  getFarms() {
    this._farmService.getFarms().subscribe((farms: any) => {
      console.log("farms", farms);
      if (farms && farms.value.length > 0) {
        this.farmList = farms.value;
      }
    });
  }
}

interface Farm {
  id: string;
  name: string;
  location: string;
}
