import { DssGroupedByFarm } from './../../../shared/models/dssGroupedByFarm.model';
import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IDssFlat } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: "app-dss-selection",
  templateUrl: "./dss-dashboard.component.html",
  styleUrls: ["./dss-dashboard.component.css"]
})
export class DssDashboardComponent implements OnInit, OnDestroy {
  farmsDssMap: DssGroupedByFarm[] = [];
  remoteCallLoading: boolean = false;
  $startSubscription: Subscription;
  dssJobStatus: string[] = ["Enqueued", "Processing"];

  constructor(
    protected service: DssSelectionService,
    private _logger: NGXLogger,
  ) { }

  ngOnInit() {
    // CALL  api/dss  fetch user's DSS list
    this.remoteCallLoading = true;
    this.initData();
    // detail /api/dss/{id}

  }

  public gotData(): boolean {
    if(this.farmsDssMap.length > 0){
      return true;
    }
    return false;
  }

  private initData(): void {
    this.$startSubscription = this.service.getDssList().subscribe((data: HttpResponse<IDssFlat[]>)=>{
      let dssList: IDssFlat[] = data.body;
      for (let dssItem of dssList) {
        this._logger.debug("READING DSS ITEM:",dssItem);
        if (this.isQueued(dssItem.dssTaskStatusDto.jobStatus)) {
          this._logger.debug("THE DSS IS QUEUED! STATUS:",dssItem.dssTaskStatusDto);
          this.reloadData(5);
        }
      }
      this.farmsDssMap = this.service.getDssGroupedByFarms(dssList);
      this.remoteCallLoading = false;
    });
  }

  ngOnDestroy() {
    if(this.$startSubscription){
      this.$startSubscription.unsubscribe();
    }
  }

  public isQueued(statusVal: string): boolean {
    if (this.dssJobStatus.indexOf(statusVal) >= 0) {
      return true;
    }
    return false;
  }

  public isScheduled(statusVal: string): boolean {
    if (statusVal === "Scheduled") {
      return true;
    }
    return false;
  }

  private reloadData(counter: number): void{
    this._logger.info("Reloading!");
    let intervalId = setInterval(() => {
      counter = counter - 1;
      console.log(counter);
      if(counter < 1) {
        clearInterval(intervalId);
        this.initData();
      }
  }, 1000)
  }

}