import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { ToastrService } from "ngx-toastr";
import * as L from "leaflet";
import { Farm } from "@app/shared/models/farm.model";
import { Location } from "@app/shared/models/location.model";
import { HttpResponse } from "@angular/common/http";
import { WeatherService } from "@app/shared/services/wx/weather.service";
import { WeatherDataSource } from "@app/shared/models/weather-data-source.model";
import { MapSettings } from "@app/shared/constants/map-settings.constant";
import { MaprisksService } from "@app/shared/services/maprisks.service";

@Component({
  selector: "app-add-farm",
  templateUrl: "./add-farm.component.html",
  styleUrls: ["./add-farm.component.css"],
})
export class AddFarmComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  @ViewChild("map", { static: false })
  private mapContainer: ElementRef<HTMLElement>;
  farmForm: FormGroup;
  metStationList: WeatherDataSource[] = [];
  weatherForecastList: WeatherDataSource[] = [];
  constructor(
    private _fb: FormBuilder,
    private _farmService: FarmService,
    private _weatherService: WeatherService,
    private _toastr: ToastrService,
    private _maprisksService: MaprisksService
  ) {}

  ngOnInit() {
    this.form();
    this.getWeatherForecastList();
    this.farmForm.get("weatherStationDto").disable();
  }

  ngAfterViewInit(): void {
    this._maprisksService
      .initialize(this.mapContainer.nativeElement)
      .subscribe((initMap) => {
        this.map = initMap;
      });

    this._maprisksService.addMarker(this.map);

    this._maprisksService.locationObservable.subscribe((locPoint) => {
      if (locPoint) {
        const location = this.mapLocationCoordinates(locPoint.latlng);

        // populate met. station dropdown with nearest weather stations
        this.getNearestWeatherDataSource(location.x, location.y);

        if (location) {
          this.farmForm.controls.location.setValue(location);
          this.farmForm.get("weatherStationDto").enable();
        }
      }
    });
  }

  private mapLocationCoordinates(rawObj: any) {
    return <Location>{
      x: rawObj.lat,
      y: rawObj.lng,
      srid: MapSettings.SRID,
    };
  }

  form() {
    this.farmForm = this._fb.group({
      name: ["", Validators.required],
      location: ["", Validators.required],
      weatherDataSourceDto: ["", Validators.required],
      weatherStationDto: ["", Validators.required],
    });
  }

  get f() {
    return this.farmForm.controls;
  }

  onFarmSubmit() {
    if (this.farmForm.invalid) {
      this._toastr.show("Invalid form data!", "Error!", null, "toast-error");
      return;
    }

    const formValues: any = this.farmForm.value;

    this._farmService.createFarm(formValues).subscribe(
      (addFarmResponse: HttpResponse<Farm>) => {
        if (addFarmResponse) {
          this._toastr.show(
            "Farm successfully created!",
            "Success!",
            null,
            "toast-success"
          );
        }
      },
      (error) => {
        console.log("catched error show msg", error);
        this._toastr.show(
          "Unable to create farm!",
          "Error!",
          null,
          "toast-error"
        );
      }
    );
  }

  private getNearestWeatherDataSource(
    lat: number,
    lng: number,
    tol: number = 50000
  ) {
    this._weatherService
      .getWeatherDataSourceLocationPoint(lat, lng, tol)
      .subscribe((metStationData: WeatherDataSource[]) => {
        if (metStationData) {
          console.log("nesto", metStationData);
          this.metStationList = metStationData;
        }
      });
  }

  private getWeatherForecastList() {
    this._weatherService.getWeatherForecastIdName().subscribe((forecast) => {
      this.weatherForecastList = forecast;
    });
  }
}
