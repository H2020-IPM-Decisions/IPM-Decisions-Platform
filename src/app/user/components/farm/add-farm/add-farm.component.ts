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
import { WeatherDataSourceDto } from "@app/shared/models/weather-data-source-dto.model";
import { MapSettings } from "@app/shared/constants/map-settings.constant";
import { MaprisksService } from "@app/shared/services/maprisks.service";
import { map, mergeMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-farm",
  templateUrl: "./add-farm.component.html",
  styleUrls: ["./add-farm.component.css"],
})
export class AddFarmComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  isSaving = false;
  suscription$?: Subscription;

  @ViewChild("map", { static: false })
  private mapContainer: ElementRef<HTMLElement>;
  farm?: Farm;
  farmForm: FormGroup;
  metStationList: WeatherDataSource[] = [];
  weatherForecastList: WeatherDataSourceDto[] = [];
  constructor(
    private _fb: FormBuilder,
    private _farmService: FarmService,
    private _weatherService: WeatherService,
    private _toastr: ToastrService,
    private _maprisksService: MaprisksService,
    private _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.suscription$ = this._activatedRoute.data
      .pipe(
        mergeMap( ({farm}) => {
          this.updateForm(farm);
          return this._weatherService.getForecastServices();
        })
      ).subscribe( (data: WeatherDataSource[]) => { 
          this.weatherForecastList = data.filter((item: WeatherDataSource) => {
            return item.access_type === "stations" && item.authentication_required === "false";
          }).map((item: WeatherDataSource)=>{          
            const dto = new WeatherDataSourceDto(item.id, item.name, item.temporal.forecast==0, item.authentication_required==='true', item.endpoint);
            return dto;
          });

          if(!this.farm && this.weatherForecastList && this.weatherForecastList.length>0){
            this.farmForm.patchValue({
              weatherDataSourceDto: this.weatherForecastList[0]
            });
          }
        });
  }

  ngAfterViewInit(): void {
    const initFarmLocation = (this.farm && this.farm.location)?this.farm.location:undefined;
    this._maprisksService
      .initialize(this.mapContainer.nativeElement, initFarmLocation)
      .subscribe((initMap) => {
        this.map = initMap;
      });

    this._maprisksService.addMarker(this.map, initFarmLocation);

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

  updateForm(data: Farm) {
    this.farmForm = this._fb.group({
      name: ["", Validators.required],
      location: ["", Validators.required],
      weatherDataSourceDto: ["", Validators.required],
      weatherStationDto: ["", Validators.required],
    });
    this.farmForm.get("weatherStationDto").disable();
    if(data){
      this.farm = data;
      if(this.weatherForecastList.length==0){
        this.weatherForecastList.push(data.weatherDataSourceDto);
      }
      if(this.metStationList.length==0){
        this.metStationList.push(data.weatherStationDto);
      }
      this.farmForm.patchValue({
        name: data.name,
        location: data.location,
        weatherDataSourceDto: data.weatherDataSourceDto,
        weatherStationDto: data.weatherStationDto
      });      
      this.farmForm.get('weatherDataSourceDto').updateValueAndValidity();
      this.farmForm.get('weatherStationDto').updateValueAndValidity();
      this.farmForm.get("weatherStationDto").enable();
    }
  }

  get f() {
    return this.farmForm.controls;
  }

  onFarmSubmit() {
    if (this.farmForm.invalid) {
      this._toastr.show("Invalid form data!", "Error!", null, "toast-error");
      return;
    }
    this.isSaving = true;
    const formValues: any = this.farmForm.value;
    let observable: any;
    if(this.farm && this.farm.id){
      observable = this._farmService.updateFarm(formValues);
    } else {
      observable = this._farmService.createFarm(formValues)
    }
    observable.subscribe(
        (addFarmResponse: HttpResponse<Farm>) => {
          this.submitSuccess(addFarmResponse);
        },
        (error) => {
          this.submitError(error);
        }
    );
  }

  submitSuccess(data:any):void{
    this.isSaving = false;
    if (data) {
      this._toastr.show(
        "Farm successfully created!",
        "Success!",
        null,
        "toast-success"
      );
      window.history.back();
    }
  }

  submitError(error):void{
    console.log("catched error show msg", error);
    this.isSaving = false;
    this._toastr.show(
      "Unable to create farm!",
      "Error!",
      null,
      "toast-error"
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
          this.metStationList = metStationData;
          if(this.metStationList.length>0){
            this.farmForm.patchValue({
              weatherStationDto: this.metStationList[0]
            });
          }
        }
      });
  }

  goBack():void{
    window.history.back();
  }
}
