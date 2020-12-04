import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Farm } from "@app/shared/models/farm.model";
import { Field } from "@app/shared/models/field.model";
import { WeatherDataSource } from "@app/shared/models/weather-data-source.model";
import { FarmService } from "@app/shared/services/upr/farm.service";
import { FieldService } from "@app/shared/services/upr/field.service";
import { WeatherService } from "@app/shared/services/wx/weather.service";
import { compare } from "fast-json-patch";
import L from "leaflet";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";

@Component({
  selector: "app-edit-farm",
  templateUrl: "./edit-farm.component.html",
  styleUrls: ["./edit-farm.component.css"],
  providers: [BsModalRef],
})
export class EditFarmComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  @ViewChild("map", { static: false })
  private mapContainer: ElementRef<HTMLElement>;
  editFarmForm: FormGroup;
  currentFarmValues: Farm;
  fieldList: any[] = [];
  metStationList: WeatherDataSource[] = [];
  weatherForecastList: WeatherDataSource[];
  modalRef: BsModalRef;
  selectedCrop: any;

  constructor(
    private _fb: FormBuilder,
    private _modalService: BsModalService,
    private _router: Router,
    private _farmService: FarmService,
    private _fieldService: FieldService,
    private _weatherService: WeatherService,
    private _toastr: ToastrService
  ) {}
  ngOnInit() {
    this.initEditFarmForm();

    this._farmService.currentFarm.subscribe((farm: Farm) => {
      // console.log("faxxxxxxxxxxxrm", farm);

      if (farm) {
        this.editFarmForm.patchValue(farm);
        this.currentFarmValues = farm;
        if (farm.id) {
          this.onGetFields();
        }
      }
    });

    this._weatherService.getMetStations().subscribe((metStations) => {
      if (metStations) {
        this.metStationList = metStations;
      }
    });

    this._weatherService.getForecastServices().subscribe((forecast) => {
      if (forecast) {
        this.weatherForecastList = forecast;
      }
    });
  }

  ngAfterViewInit(): void {
    this.showFarmLocationOnMap();
  }

  initEditFarmForm() {
    this.editFarmForm = this._fb.group({
      id: [],
      name: ["", Validators.required],
      location: ["", Validators.required],
      inf1: ["", Validators.required],
      inf2: ["", Validators.required],
    });
  }

  private showFarmLocationOnMap(): void {
    const farmLocation = this.currentFarmValues.location
      ? this.currentFarmValues.location
      : null;

    const initialState = {
      lng: farmLocation.x,
      lat: farmLocation.y,
      zoom: 12,
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
    L.marker([farmLocation.x, farmLocation.y])
      .addTo(map)
      .bindPopup(farmLocation.address.longLabel)
      .openPopup();

    // many markers
    // this.locations.forEach((location) => {
    //   L.marker([location[1], location[2]]).addTo(map).bindPopup(location[0]).openPopup();
    // });
    this.map = map;
    // this.getMarkerLocation(map); // todo: create map service
    // console.log('nesto bla',  this.farmForm);
  }

  get f() {
    return this.editFarmForm.controls;
  }

  onFarmUpdate() {
    const updatedFarmValues = this.editFarmForm.value;
    updatedFarmValues.links = this.currentFarmValues.links;
    let obs: Observable<any> = null;

    if (!updatedFarmValues.id) {
      obs = this._farmService.createFarm(updatedFarmValues);
    } else {
      const patch = compare(this.currentFarmValues, updatedFarmValues);
      obs = this._farmService.updateFarm(patch);
    }

    obs.subscribe(
      (result: HttpResponse<any>) => {
        if (result.ok && (result.status === 204 || result.status === 201)) {
          this._farmService.setCurrentFarm(result.body);

          this._toastr.show(
            "Farm details successfully updated!",
            "Success!",
            null,
            "toast-success"
          );
        }
      },
      (error: HttpErrorResponse) => {
        this._toastr.show(
          "Error updating farm details!",
          "Error!",
          null,
          "toast-error"
        );
      }
    );
  }

  // FIELDS BELOW

  onGetFields() {
    this._fieldService.getFields().subscribe(
      (fields: any) => {
        console.log("odgovor response", fields);
        if (fields && fields.value) {
          this.fieldList = fields.value;
        }
      },
      (error: HttpErrorResponse) => {
        this._toastr.show(
          "Error fetching field detail!",
          "Error!",
          null,
          "toast-error"
        );
      }
    );
  }

  onEditField(field: Field) {
    this._fieldService.setCurrentField(field);
    this._router.navigate(["/user/field/edit"]);
  }

  onFieldCopy(field: any) {
    // console.log("field", field);
    const fieldToAdd: Field = this.fieldToCopy(field);

    if (fieldToAdd) {
      this._fieldService.createField(fieldToAdd).subscribe(
        (newFieldResponse) => {
          this._fieldService
            .getField(newFieldResponse.id)
            .subscribe((fieldByIdResponse) => {
              this.fieldList.push(fieldByIdResponse);

              if (fieldByIdResponse) {
                this._toastr.show(
                  "Field has been successfully copied!",
                  "Success!",
                  null,
                  "toast-success"
                );
              }
            });
        },
        (error: HttpErrorResponse) => {
          console.log("field error", error);
          this._toastr.show(
            "Field copy failed!",
            "Error!",
            null,
            "toast-error"
          );
        }
      );
    }
  }

  private fieldToCopy(field: any): any {
    let cropPest: any[] = [];
    field.fieldCropPestsDto.value.forEach((item) => {
      cropPest.push({
        cropEppoCode: item.cropPestDto.cropEppoCode,
        pestEppoCode: item.cropPestDto.pestEppoCode,
      });
    });

    return <any>{
      id: null,
      name: field.name + " [Copy]",
      inf1: field.inf1,
      inf2: field.inf2,
      cropPests: cropPest,
    };
  }

  onFieldDelete(fieldId: string) {
    if (fieldId) {
      this._fieldService
        .deleteFieldById(fieldId)
        .subscribe((response: HttpResponse<any>) => {
          if (response.status === 204) {
            this._modalService.hide(1);

            const index: number = this.fieldList.findIndex(
              (item) => item.id === fieldId
            );

            if (index !== -1) {
              this.fieldList.splice(index, 1);
            }
          }
        });
    }
  }

  openModal(template: TemplateRef<any>, field: any) {
    this.modalRef = this._modalService.show(template);
    this.showFieldDetails(field);
  }

  showFieldDetails(field: any) {
    this.selectedCrop = field;
  }
}
