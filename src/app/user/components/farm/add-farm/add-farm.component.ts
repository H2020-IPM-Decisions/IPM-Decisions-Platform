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
import * as esri from "esri-leaflet";
import * as esriGeo from "esri-leaflet-geocoder";
import { Farm } from "@app/shared/models/farm.model";
import { Location } from "@app/shared/models/location.model";
import { HttpResponse } from "@angular/common/http";
import { WeatherService } from "@app/shared/services/wx/weather.service";
import { WeatherDataSource } from "@app/shared/models/weather-data-source.model";

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
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form();
    this.getWeatherForecastServices();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.setMarkerLocation(this.map, this.farmForm);
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

  private initMap(): void {
    const initialState = {
      lng: 58.6,
      lat: 47.9,
      zoom: 2,
    };

    const map = new L.Map(this.mapContainer.nativeElement).setView(
      [initialState.lat, initialState.lng],
      initialState.zoom
    );

    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(map);

    // one marker
    // L.marker([51.5, -0.09]).addTo(map).bindPopup("Farm name").openPopup();

    // many markers
    // this.locations.forEach((location) => {
    //   L.marker([location[1], location[2]]).addTo(map).bindPopup(location[0]).openPopup();
    // });
    this.map = map;
    // this.getMarkerLocation(map); // todo: create map service
    // console.log('nesto bla',  this.farmForm);
  }

  setMarkerLocation(map: any, form: FormGroup) {
    var marker;
    let farmLocation: Location;

    const fontAwesomeIcon = L.divIcon({
      html: '<i class="fa fa-map-marker fa-2x"></i>',
      iconSize: [20, 20],
      className: "myDivIcon",
    });

    const geocodeService = esriGeo.geocodeService();
    var self = this;
    map.on("click", (e) => {
      if (marker) {
        map.removeLayer(marker);
      }

      // marker = L.marker(e.latlng,{ icon:  fontAwesomeIcon}).addTo(map);
      geocodeService
        .reverse()
        .latlng(e.latlng)
        .run(function (error, result) {
          if (error) {
            return;
          }
          
          self.getWeatherDataSourceLocation(
            result.latlng.lat,
            result.latlng.lng,
            2500
          );

          // set farm marker
          marker = L.marker(result.latlng)
            .addTo(map)
            .bindPopup(result.address.Match_addr)
            .openPopup();

          farmLocation = {
            address: {
              address: result.address.Address,
              city: result.address.City,
              postal: result.address.Postal,
              countryCode: result.address.CountryCode,
              region: result.address.region,
              longLabel: result.address.LongLabel,
              shortLabel: result.address.ShortLabel,
            },
            x: result.latlng.lat,
            y: result.latlng.lng,
            srid: 4326,
          };
          if (farmLocation) {
            form.controls.location.setValue(farmLocation);
          }
        });
    });
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

  private getWeatherDataSourceLocation(
    lat: number,
    lng: number,
    tol: number = 50000
  ) {
    this._weatherService
      .getWeatherDataSourceLocationPoint(lat, lng, tol)
      .subscribe((metStationData: WeatherDataSource[]) => {
        this.metStationList = metStationData;
      });
  }

  private getWeatherForecastServices() {
    this._weatherService.getForecastServices().subscribe((forecast) => {
      this.weatherForecastList = forecast;
    });
  }
}
