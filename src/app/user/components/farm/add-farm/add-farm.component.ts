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
import { FarmModel } from "@app/shared/models/farm.model";
import { FarmLocation } from "@app/shared/models/farm-location.model";
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: "app-add-farm",
  templateUrl: "./add-farm.component.html",
  styleUrls: ["./add-farm.component.css"],
})
export class AddFarmComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  @ViewChild("map", { static: false }) private mapContainer: ElementRef<
    HTMLElement
  >;
  farmForm: FormGroup;
  canRedirect: boolean = true;
  constructor(
    private _fb: FormBuilder,
    private _farmService: FarmService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.setMarkerLocation(this.map, this.farmForm);
  }

  form() {
    this.farmForm = this._fb.group({
      name: ["", Validators.required],
      location: ["", Validators.required],
      metStation: ["", Validators.required],
      forecast: ["", Validators.required],
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
    let farmLocation: FarmLocation;
    map.on("click", function (e) {
      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker(e.latlng).addTo(map);

      farmLocation = {
        x: e.latlng.lat,
        y: e.latlng.lng,
        srid: 4326,
      };
      if (farmLocation) {
        form.controls.location.setValue(farmLocation);
      }
    });

    // { metStationName: "Met. Station_1", metStationCoords: { lat: 11.8166, lng: 122.0942 } },
    // this.farm.metStationCoords = e.latlng;
    // console.log(this.farm.metStationCoords); // e is an event object (MouseEvent in this case)
    // });
  }

  onFarmSubmit() {
    if (this.farmForm.invalid) return;

    const formValues: FarmModel = this.farmForm.value;

    this._farmService.createFarm(formValues).subscribe(
      (addFarmResponse: HttpResponse<FarmModel>) => {
        console.log("response", addFarmResponse);

        if (addFarmResponse) {
          this._toastr.show(
            "Farm successfully created!",
            "Success!",
            null,
            "toast-success"
          );
          this.canRedirect = false;
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
}
