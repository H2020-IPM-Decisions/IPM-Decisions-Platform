import { Component, OnDestroy, OnInit } from "@angular/core";
@Component({
  selector: "app-dss-selection",
  templateUrl: "./dss-dashboard.component.html",
  styleUrls: ["./dss-dashboard.component.css"]
})
export class DssDashboardComponent implements OnInit, OnDestroy {

  testCrop= 'DAUCS';
  constructor(  
  ) { }

  ngOnInit() {

    // CALL  api/dss  fetch user's DSS list
    // detail /api/dss/{id}

  }

  ngOnDestroy() {
  }

}