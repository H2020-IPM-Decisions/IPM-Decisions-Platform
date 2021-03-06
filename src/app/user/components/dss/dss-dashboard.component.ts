import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IDssFlat } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
@Component({
  selector: "app-dss-selection",
  templateUrl: "./dss-dashboard.component.html",
  styleUrls: ["./dss-dashboard.component.css"]
})
export class DssDashboardComponent implements OnInit, OnDestroy {
  dssMap: Map<string, IDssFlat[]> = new Map<string, IDssFlat[]>();
  $startSubscription: Subscription;

  constructor(protected service: DssSelectionService 
  ) { }

  ngOnInit() {

    // CALL  api/dss  fetch user's DSS list
    this.$startSubscription = this.service.getDssList().subscribe((data: HttpResponse<IDssFlat[]>)=>{
      this.dssMap = this.service.getDssMap(data.body);
    });
    // detail /api/dss/{id}

  }

  ngOnDestroy() {
    if(this.$startSubscription){
      this.$startSubscription.unsubscribe();
    }
  }

}