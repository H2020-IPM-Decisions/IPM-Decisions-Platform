import { Component, OnInit } from '@angular/core';
import { UserProfileService } from "@app/shared/services/upr/user-profile.service";
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Farm } from "@app/shared/models/farm.model";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import { UserWeatherStationInfo, UserWeatherStationUpdate, WeatherDataSource } from '@app/shared/models/weather-data-source.model';
import { FarmService } from '@app/shared/services/upr/farm.service';
import { FarmResponseModel } from '@app/shared/models/farm-response.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherService } from '@app/shared/services/wx/weather.service';
import { NGXLogger } from "ngx-logger";
import * as $ from 'jquery'

@Component({
    selector: 'app-weather-station-details',
    templateUrl: './weather-station-details.component.html',
    styleUrls: ['./weather-station-details.component.css']
  })
export class WeatherStationDetailsComponent implements OnInit {

    weatherStation: UserWeatherStationInfo;

    farmList: Farm[];
    isTheFarmAssociated: boolean[] = [];

    noFarmsAvailable: boolean = false;
    public weatherStationAuthForm: FormGroup;
    
    public doesTheProviderRequiresAuth: boolean = false;

    constructor(
        private _farmService: FarmService,
        private _userProfileService: UserProfileService,
        private _toastrTranslated: ToastrTranslationService,
        private _route: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _weatherService: WeatherService,
        private _logger: NGXLogger
    ) {
    
    }

    ngOnInit(): void {
        this.initForm();
        this._route.paramMap.subscribe(params =>
            { 
                const id = (params.get('id') as string);
                this._userProfileService.getUserWeatherStation(id).subscribe(
                    (response: HttpResponse<UserWeatherStationInfo>) => {
                        this.weatherStation = response.body;
                        this.getWeatherStationAuthenticatioType();
                        this.initFormValues();
                        this.getAllFarms();
                    }
                );

            }
        )
    }

    private initFormValues(){
        $("#weatherStationId").val(this.weatherStation.weatherStationId);
        $("#weatherStationReference").val(this.weatherStation.weatherStationReference);

        setTimeout(()=>{
            $("#username").val(this.weatherStation.userName);
            $("#password").val("");
        },250);
        
    }

    public initForm() {
        this.weatherStationAuthForm = this._formBuilder.group(
            {
                WeatherStationId: ['', [
                    Validators.required,
                    Validators.pattern("^[^!\$@\{\}\.`'\"~:]*$")
                    ]
                ],
                WeatherStationReference: ['',
                    Validators.pattern("^[^!\$@\{\}\.`'\"~:]*$")
                ],
                Username: ['',Validators.required],
                Password: ['', Validators.required]
            }
        );

        
    }

    get f() {
        return this.weatherStationAuthForm.controls;
    }

    onSubmit() {

        if (this.weatherStationAuthForm.invalid) {
            return;
        }

        const WeatherStationUpdatedInfo: UserWeatherStationUpdate = {
            weatherStationId: (<string>this.f.WeatherStationId.value),
            weatherStationReference: (<string>this.f.WeatherStationReference.value),
            userName: (<string>this.f.Username.value),
            Password: (<string>this.f.Password.value),
        };

        this.updateWeatherStationData(WeatherStationUpdatedInfo);

    }

    updateWeatherStationData(WeatherStationUpdatedInfo: UserWeatherStationUpdate) {
        this._userProfileService.updateUserWeatherStation(WeatherStationUpdatedInfo, this.weatherStation.id).subscribe(
            (response: HttpResponse<any>) => {


                this._toastrTranslated.showTranslatedToastr("Information_messages.Weather_station_data_updated",
                                                            "Common_labels.Success",
                                                            "toast-success");
                this.weatherStation.userName = WeatherStationUpdatedInfo.userName;
                this.weatherStation.weatherStationReference = WeatherStationUpdatedInfo.weatherStationReference;
                this.weatherStation.weatherStationId = WeatherStationUpdatedInfo.weatherStationId;
                this.initFormValues();
            },
            (error: HttpErrorResponse) => {
                this._toastrTranslated.showTranslatedToastr("Error_messages.Weather_station_data_update_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        )
    }

    getAllFarms(){
        this._farmService.getAllFarms().subscribe(
            (response: HttpResponse<FarmResponseModel>) => {
                const farms = response.body.value;
                farms.forEach((farm) => {
                    if(!(farm.name === "Autogenerated_ExternalDss_Farm")) {
                      this._farmService.getAddressFromCoordinates(farm.location.y, farm.location.x).subscribe( (data) => farm.location.address = data);
                    }      
                });
                this.farmList = farms;
                this.removeAutogeneratedFarmFromList();
                if(this.farmList.length == 0){
                    this.noFarmsAvailable = true;
                    this._toastrTranslated.showTranslatedToastr("Information_messages.No_farms_available",
                                                                "Common_labels.Warning",
                                                                "toast-warning");
                }else{
                    this.updateFarmStatus();
                }
            }
        );
    }

    updateFarmStatus(){

        for (let index = 0; index < this.farmList.length; index++) { 
            if(this.weatherStation.farms.find((farm) => farm.id === this.farmList[index].id) === undefined){
                this.isTheFarmAssociated.push(false);
            }else{
                this.isTheFarmAssociated.push(true);
            }
        }
    }

    private removeAutogeneratedFarmFromList():void {
        for (let i = 0; i < this.farmList.length; i++) {
          if (this.farmList[i].name === "Autogenerated_ExternalDss_Farm") {
            this.farmList.splice(i--, 1);
          }
        }
    }

    associateFarm(farmId: string, index: number){
        this._userProfileService.getAllUserWeatherStations().subscribe(
            (response: HttpResponse<UserWeatherStationInfo[]>) => {
                let farmAlreadyAssociated = false;
                for(var weatherStation of response.body){
                    if(weatherStation.farms.find((farm) => farm.id === farmId) != undefined){
                        this._toastrTranslated.showTranslatedToastr("Warning_messages.Farm_already_associated",
                                                                    "Common_labels.Warning",
                                                                    "toast-warning");
                        farmAlreadyAssociated = true;
                        break
                    }
                }
                if(!farmAlreadyAssociated){
                    this.doAssociation(farmId, index);
                }

            },
            (error: HttpErrorResponse) => {
            }
        );
        
    }

    doAssociation(farmId: string, index: number){
        this._userProfileService.addFarmsToWeatherStation([farmId], this.weatherStation.id).subscribe(
            (response: HttpResponse<any>) => {

                this.isTheFarmAssociated[index] = true;
                this._toastrTranslated.showTranslatedToastr("Information_messages.Farm_associated",
                                                            "Common_labels.Success",
                                                            "toast-success");
            },
            (error: HttpErrorResponse) => {
                this._toastrTranslated.showTranslatedToastr("Error_messages.Farm_association_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        );
    }

    disassociateFarm(farmId: string, index: number){
        this._userProfileService.deleteFarmsFromWeatherStation([farmId], this.weatherStation.id).subscribe(
            (response: HttpResponse<any>) => {

                this.isTheFarmAssociated[index] = false;
                this._toastrTranslated.showTranslatedToastr("Information_messages.Farm_disassociated",
                                                            "Common_labels.Success",
                                                            "toast-success");
            },
            (error: HttpErrorResponse) => {
                this._toastrTranslated.showTranslatedToastr("Error_messages.Farm_disassociation_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        )
    }

    private getWeatherStationAuthenticatioType(){
        this._weatherService.getSingleWeatherStationDataSource(this.weatherStation.weatherId).subscribe(
            (response: HttpResponse<WeatherDataSource>) => {
                if(response.body.authentication_type === "NONE"){
                    this.doesTheProviderRequiresAuth = false;
                }else{
                    this.doesTheProviderRequiresAuth = true;
                }
            },
            (error: HttpErrorResponse) => {
                this._logger.error(error);
            }
        );
    }

}