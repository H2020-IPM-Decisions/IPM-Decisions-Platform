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
import * as L from "leaflet";
import { Location } from "@app/shared/models/location.model";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { MaprisksService } from "@app/shared/services/maprisks.service";
import { MapSettings } from "@app/shared/constants/map-settings.constant";

@Component({
  selector: "app-edit-farm",
  templateUrl: "./edit-farm.component.html",
  styleUrls: ["./edit-farm.component.css"],
  providers: [BsModalRef],
})
export class EditFarmComponent implements OnInit, AfterViewInit {
  private initialMap: L.Map;
  @ViewChild("map", { static: false })
  private mapContainer: ElementRef<HTMLElement>;
  editFarmForm: FormGroup;
  currentFarm: Farm;
  fieldList: any[] = [];
  metStationList: WeatherDataSource[] = [];
  weatherForecastList: WeatherDataSource[];
  modalRef: BsModalRef;
  selectedCrop: any;

  metStationSelected = 0;
  weatherForecastSelected = 1;

  constructor(
    private _fb: FormBuilder,
    private _modalService: BsModalService,
    private _router: Router,
    private _farmService: FarmService,
    private _fieldService: FieldService,
    private _weatherService: WeatherService,
    public _maprisksService: MaprisksService,
    private _toastr: ToastrService
  ) {}
  ngOnInit() {
    this.initEditFarmForm();

    // todo: update dropdown with selected met. station from add farm
    this._weatherService
      .getMeteorologicalStationIdName()
      .subscribe((metStations) => {
        if (metStations) {
          this.metStationList = metStations;
        }
      });

    this._weatherService.getWeatherForecastIdName().subscribe((forecast) => {
      if (forecast) {
        this.weatherForecastList = forecast;
      }
    });

    this.editFarmForm.get("weatherStationDto").disable();

    this._farmService.currentFarm.subscribe((farm: Farm) => {
      // console.log("faxxxxxxxxxxxrm", farm);

      if (farm) {
        this.editFarmForm.patchValue(farm);
        this.currentFarm = farm;
        if (farm.id) {
          this.onGetFields();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this._maprisksService
      .initialize(this.mapContainer.nativeElement, this.currentFarm.location)
      .subscribe((initMap) => {
        this.initialMap = initMap;
      });

    this._maprisksService.addMarker(this.initialMap, this.currentFarm.location);

    this._maprisksService.locationObservable.subscribe((locPoint) => {
      if (locPoint) {
        const location = this.mapLocationCoordinates(locPoint.latlng);

        // populate met. station dropdown with nearest weather stations
        this.getNearestWeatherDataSource(location.x, location.y);

        if (location) {
          this.editFarmForm.controls.location.setValue(location);
          this.editFarmForm.get("weatherStationDto").enable();
        }
      }
    });
  }

  private mapLocationCoordinates(rawObj: any) {
    return <Location>{
      x: rawObj.lat,
      y: rawObj.lng,
      srid: MapSettings.SRID,
    };
  }

  initEditFarmForm() {
    this.editFarmForm = this._fb.group({
      id: [],
      name: ["", Validators.required],
      location: ["", Validators.required],
      weatherStationDto: ["", Validators.required],
      weatherDataSourceDto: ["", Validators.required],
    });
  }

  private getNearestWeatherDataSource(
    lat: number,
    lng: number,
    tol: number = MapSettings.TOLERANCE_IN_METERS
  ) {
    this._weatherService
      .getWeatherDataSourceLocationPoint(lat, lng, tol)
      .subscribe((metStationData: WeatherDataSource[]) => {
        if (metStationData) {
          this.metStationList = metStationData;
        }
      });
  }

  get f() {
    return this.editFarmForm.controls;
  }

  onFarmUpdate() {
    if (this.editFarmForm.invalid) return;

    const updatedFarmValues = this.editFarmForm.value;
    updatedFarmValues.links = this.currentFarm.links;
    let obs: Observable<any> = null;

    if (!updatedFarmValues.id) {
      obs = this._farmService.createFarm(updatedFarmValues);
    } else {
      const patch = compare(this.currentFarm, updatedFarmValues);
      const changedPatch = this.prepareForEditing(patch);
      obs = this._farmService.updateFarm(changedPatch);
    }

    obs.subscribe(
      (result: HttpResponse<any>) => {
        if (result.ok) {
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

  private prepareForEditing(patch) {
    let arr = [];
    patch.forEach((item, index) => {
      if (item["op"] === "replace") {
        switch (item.path) {
          case "/weatherDataSourceDto/id":
          case "/weatherStationDto/id":
          case "/location/x":
            break;

          case "/weatherDataSourceDto/name":
            item["path"] = "/weatherDataSourceDto";
            item["value"] = { name: item.value, id: patch[index + 1].value };
            arr.push(item);
            break;

          case "/weatherStationDto/name":
            item["path"] = "/weatherStationDto";
            item["value"] = { name: item.value, id: patch[index + 1].value };
            arr.push(item);
            break;

          case "/location/y":
            item["path"] = "/location";
            item["value"] = { y: item.value, x: patch[index + 1].value };
            arr.push(item);
            break;

          default:
            arr.push(item);
        }
      }
    });
    return arr;
  }

  // FIELDS BELOW

  onGetFields() {
    this._fieldService.getFields().subscribe(
      (fields: any) => {
        // console.log("odgovor response", fields);
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

  compareByID(objOne: WeatherDataSource, objTwo: WeatherDataSource) {
    return objOne && objTwo && objOne.id == objTwo.id;
  }
}
