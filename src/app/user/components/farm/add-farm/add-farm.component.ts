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
import { WeatherDataSourceDto } from "@app/shared/models/weather-data-source.model";
import { MapSettings } from "@app/shared/constants/map-settings.constant";
import { MaprisksService } from "@app/shared/services/maprisks.service";
import {  mergeMap } from "rxjs/operators";
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
  weatherHistoricalDtoList: WeatherDataSourceDto[] = [];
  weatherForecastDtoList: WeatherDataSourceDto[] = [];
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
          return this._weatherService.getWeatherForecastDto();
        })
      ).subscribe( (weatherDataSourceDtoList: WeatherDataSourceDto[]) => { 
          this.weatherForecastDtoList = weatherDataSourceDtoList;
          // If it's creation set (no giving farm as input) and
          // If we get an array of values 
          // Set a default from the received list
          if(!this.farm && weatherDataSourceDtoList.length>0){
            this.farmForm.patchValue({
              weatherForecastDto: weatherDataSourceDtoList[0]
            });
          } else if(this.farm && weatherDataSourceDtoList.length>0){
            const filteredArray = this.weatherForecastDtoList.filter(item=>this.farm.weatherForecastDto.weatherId === item.weatherId);
            if(filteredArray.length==1){
              this.farmForm.patchValue({
                weatherForecastDto: filteredArray[0]
              });
            }
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
        this.getNearestWeatherDataSource(location.y, location.x);
        if (location) {
          this.farmForm.controls.location.setValue(location);
        }
        if(!this.farm){
          this.farmForm.get("weatherHistoricalDto").enable();
        }
      }
    });
  }

  private mapLocationCoordinates(rawObj: any) {
    return <Location>{
      x: rawObj.lng,
      y: rawObj.lat,
      srid: MapSettings.SRID,
    };
  }

  updateForm(data: Farm) {
    this.farmForm = this._fb.group({
      id: [null],
      name: ["", Validators.required],
      location: ["", Validators.required],
      weatherForecastDto: [""],
      weatherHistoricalDto: [""],
    });
    if(data){
      this.farm = data;
      // when a farm is giving weatherHistoricalDtoList is still empty
      this.weatherHistoricalDtoList.push(this.farm.weatherHistoricalDto);
      this.weatherForecastDtoList.push(this.farm.weatherForecastDto);
      this.farmForm.patchValue({
        id: data.id,
        name: data.name,
        location: data.location,
        weatherForecastDto: data.weatherForecastDto,
        weatherHistoricalDto: data.weatherHistoricalDto
      });      
      this.farmForm.get('weatherForecastDto').updateValueAndValidity();
      this.farmForm.get('weatherHistoricalDto').updateValueAndValidity();
    } else {
      this.farmForm.get("weatherHistoricalDto").disable();
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
    let formValues: any = this.farmForm.value;
    let observable: any;
    if(this.farm && this.farm.id){
      observable = this._farmService.updateFarm(formValues);
    } else {
      delete formValues.weatherHistoricalDto;
      delete formValues.weatherForecastDto;
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
      .getWeatherForecastDto({'latitude':lat.toString(),'longitude':lng.toString(),'tolerance':tol.toString()})
      .subscribe((weatherDataSourceDtoList: WeatherDataSourceDto[]) => {
        this.weatherHistoricalDtoList = weatherDataSourceDtoList;
        // If it's creation set (no giving farm as input) and
        // If we get an array of values and
        // This select hasn't been touched
        // Set a default from the received list
        if(!this.farm && weatherDataSourceDtoList.length>0 && !this.farmForm.controls.weatherHistoricalDto.touched){
          this.farmForm.patchValue({
            weatherHistoricalDto: weatherDataSourceDtoList[0]
          });
        }
      });
  }

  goBack():void{
    window.history.back();
  }

}
