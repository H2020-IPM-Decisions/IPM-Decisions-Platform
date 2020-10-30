import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-edit-farm",
  templateUrl: "./edit-farm.component.html",
  styleUrls: ["./edit-farm.component.css"],
  providers: [BsModalRef],
})
export class EditFarmComponent implements OnInit {
  // elements: any = [];
  // headElements = ["field", "type", "variety", "sowing_date"];

  // cropPestForm: FormGroup;
  // farmForm: FormGroup;
  // canEdit: boolean = false;

  // new
  editFarmForm: FormGroup;
  fieldDetailsForm: FormGroup;
  fieldDetailsTbl: FieldModel[] = [];

  mock = {
    name: "Heart and Soil Farm",
    address: "15 street, England",
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

  // private map: L.Map;
  // @ViewChild("map", { static: false }) private mapContainer: ElementRef<
  //   HTMLElement
  // >;

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
  modalRef: BsModalRef;
  selectedCrop: any;

  constructor(private _fb: FormBuilder, private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>, field: any) {
    this.modalRef = this.modalService.show(template);
    this.showFieldDetails(field);
  }

  showFieldDetails(field) {
    // this.showDetails = true;
    this.selectedCrop = field;
    // console.log("details field", field);
  }

  ngOnInit() {
    this.initEditFarmForm();
    this.initFieldDetailsForm();

    // this.formInit();
    // this.farmFormInit();

    // this.elements.push({
    //   field: "Big field",
    //   type: "Oilseed",
    //   variety: "KWS ",
    //   sowing_date: "24/09/2020",
    // });
    // this.elements.push({
    //   field: "Middle field",
    //   type: "Wheat",
    //   variety: "Leeds ",
    //   sowing_date: "20/09/2020",
    // });
    // this.elements.push({
    //   field: "Small field",
    //   type: "Brassica",
    //   variety: "Zulu ",
    //   sowing_date: "24/07/2020",
    // });
    // for (let i = 1; i <= 7; i++) {
    //   this.elements.push({ field: i, type: 'Crop Type ' + i, variety: 'Crop Variety ' + i, sowing_date: 'Sowing Date ' + i });
    // }
  }

  initEditFarmForm() {
    this.editFarmForm = this._fb.group({
      name: ["Heart and Soil Farm", Validators.required],
      address: ["Address 1", Validators.required],
      metStation: ["Met Station 2", Validators.required],
      forecastService: ["forecast selection 2", Validators.required],
    });
  }

  initFieldDetailsForm() {
    this.fieldDetailsForm = this._fb.group({
      crop: ["", Validators.required],
      pest: ["", Validators.required],
      field: ["", Validators.required],
      variety: ["", Validators.required],
      sowingDate: ["", Validators.required],
    });
  }

  get f() {
    return this.editFarmForm.controls;
  }

  get fAdd() {
    return this.fieldDetailsForm.controls;
  }

  onEditFarmSubmit() {
    const changedValues = this.editFarmForm.value;

    console.log("changed values from form", changedValues);

    // call service and edit
  }

  onAddFieldDetails() {
    const valuesToAdd: FieldModel = this.fieldDetailsForm.value;

    console.log("changed values from form", valuesToAdd);

    this.fieldDetailsTbl.push(valuesToAdd);
    console.log("array filed", this.fieldDetailsTbl);

    // call service and edit
  }

  // private formInit() {
  //   this.cropPestForm = this.fb.group({
  //     crop: ["", Validators.required],
  //     pest: ["", Validators.required],
  //     fieldName: ["", [Validators.required, Validators.minLength(3)]],
  //     variety: ["", Validators.required],
  //     sowingDate: ["", Validators.required],
  //   });
  // }

  // private farmFormInit() {
  //   this.farmForm = this.fb.group({
  //     name: [this.farm.name, Validators.required],
  //     // sowingDate: ['', Validators.required]
  //   });
  // }

  // ngAfterViewInit(): void {
  //   // this.initMap();
  // }

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

interface FieldModel {
  crop: string;
  pest: string;
  field: string;
  variety?: string;
  sowingDate?: string;
}
