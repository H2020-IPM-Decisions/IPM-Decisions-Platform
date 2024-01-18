import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "@app/core/auth/services/authentication.service";
import { NGXLogger } from "ngx-logger";
import { Subscription } from 'rxjs';
import { AvailableWeatherStation, UserWeatherStationInfo } from "@app/shared/models/weather-data-source.model";
import { UserProfileService } from "@app/shared/services/upr/user-profile.service";
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
    selector: "app-weather-stations",
    templateUrl: "./weather-stations.component.html",
    styleUrls: ["./weather-stations.component.css"],
})
export class WeaterStationsComponent implements OnInit {

    userRole = {description: "", value: ""};
    $AssociatedWeatherStationSubscription: Subscription;
    $AvailableWeatherStationSubscription: Subscription;

    constructor(
    public authService: AuthenticationService,
    private _logger: NGXLogger,
    private _userProfileService: UserProfileService,
    private _toastrTranslated: ToastrTranslationService
    ) {
        var userAccessType = this.authService.currentUserValue.useraccesstype;
        if (userAccessType.includes('farmer')) {
            this.userRole.description = 'Common_labels.Farmer';
            this.userRole.value = 'farmer';
        } else if (userAccessType.includes('advisor')) {
            this.userRole.description = 'Common_labels.Advisor';
            this.userRole.value = 'advisor';
        } else if (userAccessType.includes('developer')) {
            this.userRole.description = 'Common_labels.Developer';
            this.userRole.value = 'developer';
        }
    }

    public noWeatherStationsAvailable:boolean = false;
    public selectedUserWeatherStationToManage:boolean = false;

    public userWeatherStationToManage: UserWeatherStationInfo;

    public AvailableWeatherStations: AvailableWeatherStation[];
    public AssociatedWeatherStations: UserWeatherStationInfo[];
    public isTheStationAssociated: boolean[];
    

    ngOnInit(): void {
        this.retrieveAvailableWeatherStation();
    }

    retrieveAvailableWeatherStation(){
        this.AvailableWeatherStations = []
        this.$AvailableWeatherStationSubscription = this._userProfileService.getAvailableWeatherStation().subscribe(
            (response: HttpResponse<AvailableWeatherStation[]>) => {

                this.AvailableWeatherStations = response.body;
                if(this.AvailableWeatherStations.length == 0){
                  this.noWeatherStationsAvailable = true;
                  this._toastrTranslated.showTranslatedToastr("Warning_messages.Weather_stations_availability_error",
                                                              "Common_labels.Warning",
                                                              "toast-warning");
                }else{
                    this.noWeatherStationsAvailable = false;
                    this.retrieveUserWeatherStation();
                }
            },
            (error: HttpErrorResponse) => {
                this.noWeatherStationsAvailable = true;
                this._toastrTranslated.showTranslatedToastr("Error_messages.Weather_stations_retrieve_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        );
    }

    retrieveUserWeatherStation() {
        this.AssociatedWeatherStations = [];
        this.isTheStationAssociated = [];
        this.$AssociatedWeatherStationSubscription = this._userProfileService.getAllUserWeatherStations().subscribe(
            (response: HttpResponse<UserWeatherStationInfo[]>) => {
                this.AssociatedWeatherStations = response.body;
                if(this.AssociatedWeatherStations.length == 0){
                    for (let index = 0; index < this.AvailableWeatherStations.length; index++) {
                        this.isTheStationAssociated.push(false);
                    }
                }else{
                    for (let index = 0; index < this.AvailableWeatherStations.length; index++) {
                        if(this.AssociatedWeatherStations.find((weatherStation) => weatherStation.weatherId == this.AvailableWeatherStations[index].weatherId) === undefined){
                            this.isTheStationAssociated.push(false);
                        }else{
                            this.isTheStationAssociated.push(true);
                        }
                    }
                }
            },
            (error: HttpErrorResponse) => {
                this._toastrTranslated.showTranslatedToastr("Error_messages.User_weather_stations_retrieve_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        );
    }

    disassociateWeatherStation(weatherId: string){
        
        let associatedWeatherStationInfo = this.AssociatedWeatherStations.find((weatherStation) => weatherStation.weatherId == weatherId);        
        if(associatedWeatherStationInfo.farms.length > 0){
            this._toastrTranslated.showTranslatedToastr("Warning_messages.Delete_associated_farm_first",
                                                              "Common_labels.Warning",
                                                              "toast-warning");
            return;
        }
        this._userProfileService.deleteUserWeatherStation(associatedWeatherStationInfo.id).subscribe(
            (response: HttpResponse<any>) => {
                this._toastrTranslated.showTranslatedToastr("Information_messages.Weather_station_disassociated",
                                                            "Common_labels.Success",
                                                            "toast-success");
                if(this.selectedUserWeatherStationToManage && weatherId === this.userWeatherStationToManage.weatherId){
                    this.selectedUserWeatherStationToManage = false;
                    this.userWeatherStationToManage = null;
                }
                this.refreshWeatherStationLists();
            },
            (error: HttpErrorResponse) => {
                console.log(error);
                this._toastrTranslated.showTranslatedToastr("Error_messages.Weather_station_disassociation_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        )
        
    }

    manageUserWeatherStation(weatherId: string){
        this.userWeatherStationToManage = this.AssociatedWeatherStations.find((weatherStation) => weatherStation.weatherId == weatherId);
        if(!this.selectedUserWeatherStationToManage){
            this.selectedUserWeatherStationToManage = true;
        }           
    }

    refreshWeatherStationLists(){
        this.$AvailableWeatherStationSubscription.unsubscribe();
        this.$AssociatedWeatherStationSubscription.unsubscribe();
        this.retrieveAvailableWeatherStation();
    }

    closeInfo(){
        this.selectedUserWeatherStationToManage = false;
        this.userWeatherStationToManage = undefined;
    }

    updateAssociatedFarms(updateInfo){
        let weatherStationToManageInfo = this.AssociatedWeatherStations.find((weatherStation) => weatherStation.weatherId == updateInfo.weatherId);
        weatherStationToManageInfo.farms = updateInfo.farms;
    }

}