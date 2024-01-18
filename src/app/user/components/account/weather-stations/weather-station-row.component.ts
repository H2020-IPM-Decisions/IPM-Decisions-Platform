import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { AvailableWeatherStation, UserWeatherStation, UserWeatherStationInfo, WeatherDataSource } from '@app/shared/models/weather-data-source.model';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { UserProfileService } from "@app/shared/services/upr/user-profile.service";
import { WeatherService } from "@app/shared/services/wx/weather.service";
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
    selector: '[app-weather-station-row]',
    templateUrl: './weather-station-row.component.html',
    styleUrls: ['./weather-station-row.component.css'],
    providers: [BsModalRef]
  })
export class WeatherStationRowComponent implements OnInit {

    @Input() weatherStation: AvailableWeatherStation;
    @Input() isStationAssociatedWithUser: boolean;
    @Input() associationId?:string;

    @Output() Success: EventEmitter<string> = new EventEmitter();
    @Output() Disassociate: EventEmitter<string> = new EventEmitter();
    @Output() Manage: EventEmitter<string> = new EventEmitter();

    
    public weatherStationAuthForm: FormGroup;
    public weatherStationForm: FormGroup;

    public modalRef: BsModalRef;
    public submitted: boolean = false;

    private authenticationType: string;
    
    constructor(
        private _formBuilder: FormBuilder,
        private _logger: NGXLogger,
        private _userProfileService: UserProfileService,
        private _weatherService: WeatherService,
        private _toastrTranslated: ToastrTranslationService,
        private _modalService: BsModalService
    ) {
    
    }

    @ViewChild('weatherStationAuthModal') public weatherStationAuthModal: TemplateRef<any>;
    @ViewChild('weatherStationModal') public weatherStationModal: TemplateRef<any>;

    ngOnInit(): void {
        this.initForms();
        this.getWeatherStationAuthenticatioType();
    }

    public initForms() {
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

        this.weatherStationForm = this._formBuilder.group(
            {
                WeatherStationId: ['', [
                    Validators.required,
                    Validators.pattern("^[^!\$@\{\}\.`'\"~:]*$")
                ]
                ],
                WeatherStationReference: ['',
                    Validators.pattern("^[^!\$@\{\}\.`'\"~:]*$")
                ]
            }
        );
    }

    private getWeatherStationAuthenticatioType(){
        this._weatherService.getSingleWeatherStationDataSource(this.weatherStation.weatherId).subscribe(
            (response: HttpResponse<WeatherDataSource>) => {
                this.authenticationType = response.body.authentication_type;
            },
            (error: HttpErrorResponse) => {
                this._logger.error(error);
            }
        );
    }

    get f() {
        return this.weatherStationAuthForm.controls;
    }

    associateWeatherStation() {

        if(this.authenticationType == "CREDENTIALS"){
            this.openModal(this.weatherStationAuthModal,'modal-lg')
        }else{
            this.openModal(this.weatherStationModal,'modal-lg')
        }        

    }

    disassociateWeatherStation() {
        this.Disassociate.emit(this.weatherStation.weatherId);
    }

    onSubmit() {

        this.submitted = true;
        if (this.weatherStationAuthForm.invalid) {
            return;
        }

        const associateWeatherStationBody: UserWeatherStation = {
            WeatherId: this.weatherStation.weatherId,
            WeatherStationId: (<string>this.f.WeatherStationId.value),
            WeatherStationReference: (<string>this.f.WeatherStationReference.value),
            Username: (<string>this.f.Username.value),
            Password: (<string>this.f.Password.value),
        };

        this._userProfileService.getAllUserWeatherStations().subscribe(
            (response: HttpResponse<UserWeatherStationInfo[]>) => {
                let duplicateWeatherStationId = false
                for(let associatedStation of response.body){
                    if(associatedStation.weatherStationId === associateWeatherStationBody.WeatherStationId){
                        duplicateWeatherStationId = true;
                        break;
                    }
                }
                if(duplicateWeatherStationId){
                    this._toastrTranslated.showTranslatedToastr("Warning_messages.Duplicated_weather_station_id",
                                                                "Common_labels.Warning",
                                                                "toast-warning");
                }else{
                    this.doAssociation(associateWeatherStationBody);
                }
            },
            (error: HttpErrorResponse) => {
                this._logger.error(error);
            }
        )

        

    }

    onSubmitWithoutAuth(){
        // Possibili sviluppi futuri
        /*
        this.submitted = true;
        if (this.weatherStationAuthForm.invalid) {
            return;
        }

        const associateWeatherStationBody: UserWeatherStation = {
            WeatherId: this.weatherStation.weatherId,
            WeatherStationId: (<string>this.f.WeatherStationId.value),
            WeatherStationReference: (<string>this.f.WeatherStationReference.value),
            Username: " ",
            Password: " ",
        };

        this.doAssociation(associateWeatherStationBody);
        */     
    }

    openModal(template: TemplateRef<any>, size?: string) {
        this.modalRef = this._modalService.show(template, {class: size});
    }

    private doAssociation(request: UserWeatherStation){
        this._userProfileService.addWeatherStationToUser(request).subscribe(
            (response: HttpResponse<any>) => {
                this._toastrTranslated.showTranslatedToastr("Information_messages.Weather_station_associated",
                                                            "Common_labels.Success",
                                                            "toast-success");
                this.submitted = false;
                this.modalRef.hide();
                this.Success.emit();
            },
            (error: HttpErrorResponse) => {
                this._toastrTranslated.showTranslatedToastr("Error_messages.Weather_station_association_error",
                                                            "Common_labels.Error",
                                                            "toast-error");
            }
        );
    }

    manageWeatherStation(){
        this.Manage.emit(this.weatherStation.weatherId);
    }
}
