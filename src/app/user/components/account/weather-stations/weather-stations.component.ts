import { Component, OnInit, TemplateRef } from "@angular/core";
import { AuthenticationService } from "@app/core/auth/services/authentication.service";
import { NGXLogger } from "ngx-logger";
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { AvailableWeatherStation, UserWeatherStation, UserWeatherStationInfo, WeatherDataSource } from "@app/shared/models/weather-data-source.model";
import { UserProfileService } from "@app/shared/services/upr/user-profile.service";
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";
import { WeatherService } from "@app/shared/services/wx/weather.service";
import { farmRoute } from "../../farm/farm.route";
import * as $ from 'jquery'

@Component({
    selector: "app-weather-stations",
    templateUrl: "./weather-stations.component.html",
    styleUrls: ["./weather-stations.component.css"],
    providers: [BsModalRef]
})
export class WeaterStationsComponent implements OnInit {

    userRole = {description: "", value: ""};
    $AssociatedWeatherStationSubscription: Subscription;
    $AvailableWeatherStationSubscription: Subscription;

    constructor(
        private _formBuilder: FormBuilder,
        public authService: AuthenticationService,
        private _logger: NGXLogger,
        private _userProfileService: UserProfileService,
        private _toastrTranslated: ToastrTranslationService,
        private _modalService: BsModalService,
        private _weatherService: WeatherService
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

    public noWeatherStationsAssociated:boolean = false;

    public AvailableWeatherStationsProviders: AvailableWeatherStation[];
    public AssociatedWeatherStations: UserWeatherStationInfo[];

    public weatherStationAuthForm: FormGroup;
    public doesTheProviderRequiresAuth: boolean = false;

    public modalRef: BsModalRef;
    public submitted: boolean = false;

    public weatherStationProviderAuthType;
    

    ngOnInit(): void {
        this.initForm();
        this.retrieveAvailableWeatherStationsProviders();
        this.retrieveUserWeatherStation();
    }

    public initForm() {
        this.weatherStationAuthForm = this._formBuilder.group(
            {
                WeatherStationProvider: ['', [
                    Validators.required
                    ]
                ],
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
  

    retrieveAvailableWeatherStationsProviders(){
        this.AvailableWeatherStationsProviders = []
        this.$AvailableWeatherStationSubscription = this._userProfileService.getAvailableWeatherStation().subscribe(
            (response: HttpResponse<AvailableWeatherStation[]>) => {

                this.AvailableWeatherStationsProviders = response.body;
                if(this.AvailableWeatherStationsProviders.length == 0){
                  this._toastrTranslated.showTranslatedToastr("Warning_messages.Weather_stations_providers_availability_error",
                                                              "Common_labels.Warning",
                                                              "toast-warning");
                }
            },
            (error: HttpErrorResponse) => {
                this._toastrTranslated.showTranslatedToastr("Error_messages.Weather_stations_providers_retrieve_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        );
    }

    retrieveUserWeatherStation() {
        this.AssociatedWeatherStations = [];
        this.$AssociatedWeatherStationSubscription = this._userProfileService.getAllUserWeatherStations().subscribe(
            (response: HttpResponse<UserWeatherStationInfo[]>) => {
                this.AssociatedWeatherStations = response.body;
                if(this.AssociatedWeatherStations.length == 0){
                    this.noWeatherStationsAssociated = true;
                }else{
                    this.noWeatherStationsAssociated = false;
                }
            },
            (error: HttpErrorResponse) => {
                this.noWeatherStationsAssociated = true;
                this._toastrTranslated.showTranslatedToastr("Error_messages.User_weather_stations_retrieve_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        );
    }

    disassociateWeatherStation(Id: string){
        
        let weatherStationToDisassociate = this.AssociatedWeatherStations.find((weatherStation) => weatherStation.id == Id);
        let farmsToDisassociate = [];
        if(weatherStationToDisassociate.farms.length > 0){
            for(var farm of weatherStationToDisassociate.farms){
                farmsToDisassociate.push(farm.id);
            }
            this._userProfileService.deleteFarmsFromWeatherStation(farmsToDisassociate, Id).subscribe(
                (response: HttpResponse<any>) => {
                    this.doDisassociation(Id);
                },
                (error: HttpErrorResponse) => {
                    console.log(error);
                    this._toastrTranslated.showTranslatedToastr("Error_messages.Farm_disassociation_error",
                                                                "Common_labels.Error",
                                                                "toast-error");
                }
            )
        }else{
            this.doDisassociation(Id);
        }       
    }

    doDisassociation(Id: string){
        this._userProfileService.deleteUserWeatherStation(Id).subscribe(
            (response: HttpResponse<any>) => {
                this._toastrTranslated.showTranslatedToastr("Information_messages.Weather_station_disassociated",
                                                            "Common_labels.Success",
                                                            "toast-success");
                this.refreshWeatherStationList();
            },
            (error: HttpErrorResponse) => {
                console.log(error);
                this._toastrTranslated.showTranslatedToastr("Error_messages.Weather_station_disassociation_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        )
    }

    refreshWeatherStationList(){
        this.$AssociatedWeatherStationSubscription.unsubscribe();
        this.retrieveUserWeatherStation();
    }

    onSubmit() {

        this.submitted = true;
        if (this.weatherStationAuthForm.invalid) {
            return;
        }

        let associateWeatherStationBody: UserWeatherStation;

        if(this.weatherStationProviderAuthType === "NONE"){

            associateWeatherStationBody = {
                WeatherId: (<string>this.f.WeatherStationProvider.value),
                WeatherStationId: (<string>this.f.WeatherStationId.value),
                WeatherStationReference: (<string>this.f.WeatherStationReference.value),
                Username: "",
                Password: "",
            };
    
        }else if(this.weatherStationProviderAuthType === "CREDENTIALS"){
            
            associateWeatherStationBody = {
                WeatherId: (<string>this.f.WeatherStationProvider.value),
                WeatherStationId: (<string>this.f.WeatherStationId.value),
                WeatherStationReference: (<string>this.f.WeatherStationReference.value),
                Username: (<string>this.f.Username.value),
                Password: (<string>this.f.Password.value),
            };
        }

        this.doAssociation(associateWeatherStationBody);

    }

    public getWeatherStationAuthenticatioType($event: { target: HTMLInputElement }){
        let weatherId = $event.target.value;
        console.log(weatherId);
        this._weatherService.getSingleWeatherStationDataSource(weatherId).subscribe(
            (response: HttpResponse<WeatherDataSource>) => {
                this.weatherStationProviderAuthType = response.body.authentication_type;
                if(this.weatherStationProviderAuthType === "NONE"){
                    this.doesTheProviderRequiresAuth = false;
                }else{
                    this.doesTheProviderRequiresAuth = true;
                    setTimeout(()=>{
                        $("#username").val("");
                        $("#password").val("");
                    },635);
                }            
            },
            (error: HttpErrorResponse) => {
                this._logger.error(error);
            }
        );
    }

    openModal(template: TemplateRef<any>, size?: string) {        
        this.modalRef = this._modalService.show(template, {class: size});
        if(this.doesTheProviderRequiresAuth){
            setTimeout(()=>{
                $("#username").val("");
                $("#password").val("");
            },635);
        }
    }


    private doAssociation(request: UserWeatherStation){
        this._userProfileService.addWeatherStationToUser(request).subscribe(
            (response: HttpResponse<any>) => {
                this._toastrTranslated.showTranslatedToastr("Information_messages.Weather_station_associated",
                                                            "Common_labels.Success",
                                                            "toast-success");
                this.refreshWeatherStationList();
                this.submitted = false;
                this.modalRef.hide();
            },
            (error: HttpErrorResponse) => {
                this._toastrTranslated.showTranslatedToastr("Error_messages.Weather_station_association_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        );
    }

}