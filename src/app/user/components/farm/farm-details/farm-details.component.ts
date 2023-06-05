import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import * as L from "leaflet";
import { ActivatedRoute } from "@angular/router";
import { Farm } from "@app/shared/models/farm.model";
import { MaprisksService } from "@app/shared/services/maprisks.service";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from "rxjs";

@Component({
  selector: "app-farm-details",
  templateUrl: "./farm-details.component.html",
  styleUrls: ["./farm-details.component.css"],
  providers: [BsModalRef]
})
export class FarmDetailsComponent implements OnInit, OnDestroy, AfterViewInit {
  $subscription?: Subscription;
  @ViewChild("map")
  private mapContainer: ElementRef<HTMLElement>;
  private map: L.Map;
  farm?: Farm;
  farmAddress = '';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _maprisksService: MaprisksService
  ) { }

  ngOnInit() {
    this.$subscription = this._activatedRoute.data.subscribe(({ farm }) => {
      this.farm = farm;
    });
  }

  ngAfterViewInit(): void {
    const initFarmLocation = (this.farm && this.farm.location) ? this.farm.location : undefined;
    this._maprisksService
      .initialize(this.mapContainer.nativeElement, initFarmLocation)
      .subscribe((initMap) => {
        this.map = initMap;
      });
    this._maprisksService.addMarker(this.map, initFarmLocation, false);
  }

  ngOnDestroy() {
    if (this.$subscription) {
      this.$subscription.unsubscribe();
    }
  }

  goBack(): void {
    window.history.back();
  }
}
