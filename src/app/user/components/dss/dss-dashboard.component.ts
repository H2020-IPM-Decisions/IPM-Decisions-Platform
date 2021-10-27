import { DssGroupedByFarm } from './../../../shared/models/dssGroupedByFarm.model';
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
  farmsDssMap: DssGroupedByFarm[] = [];
  $startSubscription: Subscription;

  constructor(protected service: DssSelectionService 
  ) { }

  ngOnInit() {
    // CALL  api/dss  fetch user's DSS list
    this.$startSubscription = this.service.getDssList().subscribe((data: HttpResponse<IDssFlat[]>)=>{
      this.farmsDssMap = this.service.getDssGroupedByFarms(data.body);
    });
    // detail /api/dss/{id}

  }

  public gotData(): boolean {
    if(this.farmsDssMap.length > 0){
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    if(this.$startSubscription){
      this.$startSubscription.unsubscribe();
    }
  }

}