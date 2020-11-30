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
import { FarmService } from "@app/shared/services/upr/farm.service";
import { FieldCropPestCombinationService } from "@app/shared/services/upr/field-crop-pest-combination.service";
import { FieldService } from "@app/shared/services/upr/field.service";
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
  editFarmForm: FormGroup;
  fieldDetailsForm: FormGroup;
  currentFarmValues: Farm;
  fieldList: any[] = [];
  modalRef: BsModalRef;
  selectedCrop: any;

  // currentPage: number;
  // numItemsPerPage: number = 3;
  // totalItems: number;
  // page: number = 1;

  // pageChanged(event: any): void {
  //   this.page = event.page;
  // }

  mock = {
    name: "Heart and Soil Farm",
    location: "15 street, England",
    nearestMetStation: "Met station 1",
    weatherForecast: "Forecast service",
    fields: [
      {
        field: "Field 1",
        crop: "Wheat",
        pest: "Aphids",
        variety: "variety_x",
        sowingDate: "01/04/2019",
        spraysApplied: [{ spray: "Mancozeb", date: "01/06/2019", rate: "2.0" }],
        listDss: [
          { name: "Aphids DSS1", parameter: "Temperature" },
          { name: "Aphid DSS2", parameter: "Aphid count" },
        ],
        pestObservation: [
          { pest: "Aphids", date: "16/06/2019", severity: "1" },
          { pest: "Aphids", date: "20/07/2019", severity: "2" },
        ],
      },
      {
        field: "Field 2",
        crop: "Apple",
        pest: "Apple scab",
        variety: "variety_y",
        sowingDate: "15/05/2019",
        spraysApplied: [{ spray: "Pest 13", date: "01/09/2019", rate: "4.0" }],
        listDss: [
          { name: "VIPS", parameter: "Temperature" },
          { name: "Apple Scab model", parameter: "humidity" },
        ],
        pestObservation: [
          { pest: "Apple scab", date: "16/06/2019", severity: "5" },
          { pest: "Apple scab", date: "25/03/2019", severity: "4" },
          { pest: "Apple scab", date: "5/10/2019", severity: "3" },
        ],
      },
      {
        field: "Field 3",
        crop: "Cabbage",
        pest: "Cabbage moth",
        variety: "variety_x",
        sowingDate: "03/05/2019",
        spraysApplied: [
          { spray: "Mancozeb 2", date: "03/08/2019", rate: "3.0" },
        ],
        listDss: [
          { name: "VIPS", parameter: "z" },
          { name: "Cabbage moth model", parameter: "x-y" },
        ],
        pestObservation: [
          { pest: "Cabbage moth", date: "16/06/2019", severity: "3" },
          { pest: "Cabbage moth", date: "20/07/2019", severity: "3" },
          { pest: "Cabbage moth", date: "5/10/2019", severity: "4" },
        ],
      },
    ],
  };
  currentState$: any;

  private map: L.Map;
  @ViewChild("map", { static: false })
  private mapContainer: ElementRef<HTMLElement>;

  // locations: any = [
  //   {
  //     metStationName: "Met. Station_1",
  //     metStationCoords: { lat: 11.8166, lng: 122.0942 },
  //   },
  //   {
  //     metStationName: "Met. Station_2",
  //     metStationCoords: { lat: 11.9804, lng: 121.9189 },
  //   },
  // ];

  // farm: any = {
  //   id: 123,
  //   farmCoords: { lat: 11.8804, lng: 121.9189 },
  //   name: "My Farm",
  // };

  constructor(
    private _fb: FormBuilder,
    private _modalService: BsModalService,
    private _router: Router,
    private _farmService: FarmService,
    private _fieldService: FieldService,
    private _fieldCropPestCombinationService: FieldCropPestCombinationService,
    private _toastr: ToastrService
  ) {}

  ngOnInit() {
    this.initEditFarmForm();
    // this.initFieldDetailsForm();

    this._farmService.currentFarm.subscribe((farm: Farm) => {
      console.log("faxxxxxxxxxxxrm", farm);

      if (farm) {
        this.editFarmForm.patchValue(farm);
        this.currentFarmValues = farm;
        if (farm.id) {
          this.onGetFields();
          // this.onGetCropPestCombinationFromField(farm.id);
        }
      }
    });
  }
  // onGetCropPestCombinationFromField(id: string) {
  //   this._fieldCropPestCombinationService.getCropPestFromField(id).subscribe(
  //     (res) => {
  //       console.log("_fieldCropPestCombinationService", res);
  //     },
  //     (error: HttpErrorResponse) => {
  //       this._toastr.show(
  //         "Error fetching crop pests combination",
  //         "Error!",
  //         null,
  //         "toast-error"
  //       );
  //     }
  //   );
  // }

  ngAfterViewInit(): void {
    this.showFarmLocationOnMap();
  }

  // getFarmById() {
  //   // get farm id parameter from url
  //   // this.getFarmByParamId();
  //   // get selected farm
  //   console.log("xxxxx", this.currentFarm);
  //   const link = this.currentFarm.links.find((item) => item.rel === "self");

  //   this._farmService.getFarmById(link.href).subscribe((farm: Farm) => {
  //     // this._farmService.getFarmById(this.farmId).subscribe((farm: Farm) => {

  //     const farmData: Farm = {
  //       id: farm.id,
  //       name: farm.name,
  //       location: farm.location,
  //       inf1: farm.inf1,
  //       inf2: farm.inf2,
  //     };
  //     this.editFarmForm.patchValue(farmData);
  //     this.currentFarmValues = farmData;
  //   });
  // }

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
    // this._fieldService.getFields(this.farmId).subscribe(
    //   (response: any) => {
    //     console.log("odgovor response", response);

    //     if (response.ok && response.status === 200) {
    //       console.log("DOGOVOVOOODDO", response.value);

    //       this.fieldList = response.body.value;
    //     }
    //   },
    //   (error: HttpErrorResponse) => {
    //     this._toastr.show(
    //       "Error updating farm information!",
    //       "Error!",
    //       null,
    //       "toast-error"
    //     );
    //   }
    // );
  }

  onEditField(field: Field) {
    this._fieldService.setCurrentField(field);
    this._router.navigate(["/user/field/edit"]);
  }

  onFieldCopy(field) {
    console.log("copy field", field);
    const fieldToAdd:Field = this.fieldMapper(field);
console.log('fieldToAdd', fieldToAdd);

    if (field) {
      this._fieldService.createField(fieldToAdd).subscribe(
        (fieldResponse) => {
          if (fieldResponse) {
            this._toastr.show(
              "Field successfully copied!",
              "Success!",
              null,
              "toast-success"
            );
          }
        },
        (error: HttpErrorResponse) => {
          console.log("field error", error);
          this._toastr.show(
            "Fail to copy field!",
            "Error!",
            null,
            "toast-error"
          );
        }
      );
    }
  }

  fieldMapper(field): Field {
    let cropPest: any[] = [];
    field.fieldCropPestsDto.value.forEach((item) => {
        cropPest.push({
          cropEppoCode: item.cropPestDto.cropEppoCode,
          pestEppoCode: item.cropPestDto.pestEppoCode,
        });
    });
    return <Field>{
      id: field.id,
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

  showFieldDetails(field) {
    // this.showDetails = true;
    this.selectedCrop = field;
    // console.log("details field", field);
  }

  // private initMap(): void {
  //   const initialState = {
  //     lng: 0,
  //     lat: 0,
  //     zoom: 9
  //   };
  //   const map = new L.Map(this.mapContainer.nativeElement).setView(
  //     [initialState.lat, initialState.lng],
  //     initialState.zoom
  //   );

  //   const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     maxZoom: 19,
  //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  //   });

  //   tiles.addTo(map);

  //   // one marker
  //   // L.marker([51.5, -0.09]).addTo(map).bindPopup("Farm name").openPopup();

  //   map.fitBounds([
  //     [11.5804, 121.5189],
  //     [11.9804, 121.9189]
  //   ]);

  //   // farm marker

  //   const farmIcon = L.divIcon({
  //     html: '<i class="fas fa-home fa-3x"></i>',
  //     iconSize: [20, 20],
  //     className: 'myDivIcon'
  //   });

  //   L.marker(this.farm.farmCoords, { icon: farmIcon }).addTo(map).bindPopup(this.farm.name);

  //   // L.circle(this.farm.farmCoords, {
  //   //   color: 'red',
  //   //   fillColor: '#f03',
  //   //   fillOpacity: 0.5,
  //   //   radius: 500
  //   // }).addTo(map).bindPopup(this.farm.name);

  //   // many markers
  //   this.locations.forEach((location) => {
  //     L.marker(location.metStationCoords).addTo(map).bindPopup(location.metStationName);
  //   });

  //   this.setMarkerLocation(map);

  // }

  // setMarkerLocation(map: any) {
  //   var marker;
  //   map.on('click', function (e) {
  //     if (marker)
  //       map.removeLayer(marker);
  //     console.log(e); // e is an event object (MouseEvent in this case)
  //     console.log(e.latlng); // e is an event object (MouseEvent in this case)
  //     marker = L.marker(e.latlng).addTo(map);

  //     // { metStationName: "Met. Station_1", metStationCoords: { lat: 11.8166, lng: 122.0942 } },
  //     this.farm.metStationCoords = e.latlng;
  //     console.log(this.farm.metStationCoords); // e is an event object (MouseEvent in this case)
  //   });
  // }

  // addToFarm() {
  //   if (this.cropPestForm.invalid) { return; }

  //   const val: CropPest = this.cropPestForm.value;

  //   if (val.sowingDate) {
  //     val.sowingDate = new Date(val.sowingDate).toLocaleDateString('en-GB').split(",")[0];
  //   }

  //   this.elements.push({ field: val.fieldName, type: val.crop, variety: val.variety, sowing_date: val.sowingDate });
  // }

  // editFarm(farmId: string) {
  //   console.log("farm ", farmId);
  //   this.canEdit = !this.canEdit;

  //   const farmValues = this.farmForm.value;

  //   this.farm.name = farmValues.name;
  //   console.log("va", this.farm.name);
  // }
}
