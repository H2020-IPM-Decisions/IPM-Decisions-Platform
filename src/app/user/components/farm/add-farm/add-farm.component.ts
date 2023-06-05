import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FarmService } from "@app/shared/services/upr/farm.service";
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
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
  selector: "app-add-farm",
  templateUrl: "./add-farm.component.html",
  styleUrls: ["./add-farm.component.css"],
})
export class AddFarmComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: L.Map;
  isSaving = false;
  $farmWeatherSubscription: Subscription;
  $farmAddressSubscription: Subscription;
  $mapInitializeSubscription: Subscription;
  $locationSubscription: Subscription;
  $farmSubmitSubscription: Subscription;

  @ViewChild("map")
  private mapContainer: ElementRef<HTMLElement>;
  farm?: Farm;
  farmForm: FormGroup;
  weatherHistoricalDtoList: WeatherDataSourceDto[] = [];
  weatherForecastDtoList: WeatherDataSourceDto[] = [];
  private browserLocation: Location;
  mapLocked: boolean;

  constructor(
    private _fb: FormBuilder,
    private _farmService: FarmService,
    private _weatherService: WeatherService,
    private _maprisksService: MaprisksService,
    private _activatedRoute: ActivatedRoute,
    private _logger: NGXLogger,
    private _toastrTranslated: ToastrTranslationService
  ) {}

  ngOnInit() {
    if (this.$farmWeatherSubscription) {
      this.$farmWeatherSubscription.unsubscribe();
    }
    this.$farmWeatherSubscription = this._activatedRoute.data
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
      
      if(this.farm) {
        this.mapLocked = true;
        var mapControls = document.querySelector<HTMLElement>('.leaflet-control-container');
        mapControls.style.display = 'none';
      } else {
        this.mapLocked = false;
      }
  }

  ngAfterViewInit(): void {
    const initFarmLocation = (this.farm && this.farm.location)?this.farm.location:undefined;
    this.$mapInitializeSubscription = this._maprisksService.initialize(this.mapContainer.nativeElement, initFarmLocation).pipe(
      mergeMap((initMap) => {
          this.map = initMap;
          return this._maprisksService.getBrowserLocation();
        }
      )
    ).subscribe((location) => {
        this.browserLocation = location;
        if(!initFarmLocation){
          this._logger.info("Browser Location",this.browserLocation);
          this._maprisksService.flyToLocation(this.map,this.browserLocation);
        }
        return this._maprisksService.locationObservable;
      }
    );

    if(this.farm) {
      if (this.$farmAddressSubscription) {
        this.$farmAddressSubscription.unsubscribe();
      }
      this.$farmAddressSubscription = this._farmService.getAddressFromCoordinates(this.farm.location.y, this.farm.location.x)
      .subscribe((data) => {
        this.farm.location.address = data
        this._maprisksService.addMarker(this.map, initFarmLocation);
      });
      document.querySelector<HTMLElement>('.leaflet-control-container').style.display = 'none';
    } else {
      this._maprisksService.addMarker(this.map, initFarmLocation);
    }

    this.$locationSubscription = this._maprisksService.locationObservable.subscribe((locPoint) => {
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
    });;
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
      this._toastrTranslated.showTranslatedToastr("Error_messages.Invalid_form_data","Common_labels.Error","toast-error");
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
    this.$farmSubmitSubscription = observable.subscribe(
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
      this._toastrTranslated.showTranslatedToastr("Information_messages.Farm_created","Common_labels.Success","toast-success");
      window.history.back();
    }
  }

  submitError(error):void{
    console.log("catched error show msg", error);
    this.isSaving = false;
    this._toastrTranslated.showTranslatedToastr("Error_messages.Unable_to_create_farm","Common_labels.Error","toast-error");
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

  public ngOnDestroy(): void {
    if (this.$farmWeatherSubscription) {
      this.$farmWeatherSubscription.unsubscribe();
    }
    if (this.$farmAddressSubscription) {
      this.$farmAddressSubscription.unsubscribe();
    }
    if (this.$mapInitializeSubscription) {
      this.$mapInitializeSubscription.unsubscribe();
    }
    if (this.$locationSubscription) {
      this.$locationSubscription.unsubscribe();
    }
    if (this.$farmSubmitSubscription) {
      this.$farmSubmitSubscription.unsubscribe();
    }
  }

  lockOrUnlockMap():void {
    this.mapLocked = !this.mapLocked;
    if (this.mapLocked) {
      document.querySelector<HTMLElement>('.leaflet-control-container').style.display = 'none';
    } else {
      document.querySelector<HTMLElement>('.leaflet-control-container').style.display = 'block';
    }
  }

}
