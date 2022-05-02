import { DssGroupedByFarm } from './../../../shared/models/dssGroupedByFarm.model';
import { HttpResponse } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { IDssFlat } from "./dss-selection.model";
import { DssSelectionService } from "./dss-selection.service";
import { NGXLogger } from 'ngx-logger';
import * as moment from "moment";

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
  isSyncronizing: boolean = false;
  
  constructor(
    protected service: DssSelectionService,
    private _logger: NGXLogger,
  ) { }

  ngOnInit() {
    // CALL  api/dss  fetch user's DSS list
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
    let scheduledTimes: number[] = []; 
    this.remoteCallLoading = true;
    this.$startSubscription = this.service.getDssList().subscribe(
      (data: HttpResponse<IDssFlat[]>)=>{
        let dssList: IDssFlat[] = data.body;
        for (let dssItem of dssList) {
          this._logger.debug("READING DSS ITEM:",dssItem);
          if (this.isQueued(dssItem.dssTaskStatusDto.jobStatus)) {
            this._logger.debug("THE DSS IS QUEUED! STATUS:",dssItem.dssTaskStatusDto);
            scheduledTimes.push(5);
          }
          if (this.isScheduled(dssItem.dssTaskStatusDto.jobStatus)){
            const duration = moment.duration(moment(dssItem.dssTaskStatusDto.scheduleTime).diff(moment()));
            let resultTime: number = +duration.asSeconds().toFixed();
            if (resultTime < 5){
              resultTime = 5;
            }
            scheduledTimes.push(resultTime);   
          }
        }
        this.farmsDssMap = this.service.getDssGroupedByFarms(dssList);
        this.remoteCallLoading = false;
        if (scheduledTimes.length > 1) {
          var sortedTimes: number[] = scheduledTimes.sort((n1,n2) => n1 - n2);
        }
        if (!this.isSyncronizing) {
          if (sortedTimes) {
            this.reloadData(sortedTimes[0]);
          } else if (scheduledTimes.length > 0) {
            this.reloadData(scheduledTimes[0]);
          }
        }
      },
      errorResponse => {
        this._logger.error("GET DSS LIST ERROR: ",errorResponse);
        this.remoteCallLoading = false;
      }
    );
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
    this.isSyncronizing = true;
    let intervalId = setInterval(() => {
      counter = counter - 1;
      if(counter < 1) {
        clearInterval(intervalId);
        this.isSyncronizing = false;
        this.initData();
      }
  }, 1000)
  }

}