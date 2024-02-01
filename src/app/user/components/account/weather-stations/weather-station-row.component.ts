import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserWeatherStationInfo } from '@app/shared/models/weather-data-source.model';
import { UserProfileService } from "@app/shared/services/upr/user-profile.service";
import { NGXLogger } from "ngx-logger";
import { ToastrTranslationService } from "@app/shared/services/toastr-translation.service";

@Component({
    selector: '[app-weather-station-row]',
    templateUrl: './weather-station-row.component.html',
    styleUrls: ['./weather-station-row.component.css']
  })
export class WeatherStationRowComponent implements OnInit {

    @Input() weatherStation: UserWeatherStationInfo;

    @Output() Disassociate: EventEmitter<string> = new EventEmitter();
    
    constructor(
        private _logger: NGXLogger,
        private _userProfileService: UserProfileService,
        private _toastrTranslated: ToastrTranslationService
    ) {
    
    }

    ngOnInit(): void {
    }


    disassociateWeatherStation() {
        this.Disassociate.emit(this.weatherStation.id);
    }

}
