import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.css']
})
export class FarmDetailsComponent implements OnInit {
  elements: any = [];
  headElements = ['field', 'type', 'variety', 'sowing_date'];

  cropPestForm: FormGroup;
  farmForm: FormGroup;
  canEdit: boolean = false;

  private map: L.Map;
  @ViewChild('map', { static: false }) private mapContainer: ElementRef<HTMLElement>;

  locations: any = [
    { metStationName: "Met. Station_1", metStationCoords: { lat: 11.8166, lng: 122.0942 } },
    { metStationName: "Met. Station_2", metStationCoords: { lat: 11.9804, lng: 121.9189 } }
  ];

  farm: any = {
    id: 123,
    farmCoords: { lat: 11.8804, lng: 121.9189 },
    name: "My Farm"
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.formInit();
    this.farmFormInit();

    // for (let i = 1; i <= 7; i++) {
    //   this.elements.push({ field: i, type: 'Crop Type ' + i, variety: 'Crop Variety ' + i, sowing_date: 'Sowing Date ' + i });
    // }

  }

  private formInit() {
    this.cropPestForm = this.fb.group({
      crop: ['', Validators.required],
      pest: ['', Validators.required],
      fieldName: ['', [Validators.required, Validators.minLength(3)]],
      variety: ['', Validators.required],
      sowingDate: ['', Validators.required]
    });
  }

  private farmFormInit() {
    this.farmForm = this.fb.group({
      name: [this.farm.name, Validators.required],
      // sowingDate: ['', Validators.required]
    });
  }

  get f() {
    return this.cropPestForm.controls;
  }
  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    const initialState = {
      lng: 0,
      lat: 0,
      zoom: 9
    };
    const map = new L.Map(this.mapContainer.nativeElement).setView(
      [initialState.lat, initialState.lng],
      initialState.zoom
    );

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(map);

    // one marker
    // L.marker([51.5, -0.09]).addTo(map).bindPopup("Farm name").openPopup();

    map.fitBounds([
      [11.5804, 121.5189],
      [11.9804, 121.9189]
    ]);


    // farm marker

    const farmIcon = L.divIcon({
      html: '<i class="fas fa-home fa-3x"></i>',
      iconSize: [20, 20],
      className: 'myDivIcon'
    });

    L.marker(this.farm.farmCoords, { icon: farmIcon }).addTo(map).bindPopup(this.farm.name);

    // L.circle(this.farm.farmCoords, {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5,
    //   radius: 500
    // }).addTo(map).bindPopup(this.farm.name);


    // many markers
    this.locations.forEach((location) => {
      L.marker(location.metStationCoords).addTo(map).bindPopup(location.metStationName);
    });


    this.setMarkerLocation(map);

  }

  setMarkerLocation(map: any) {
    var marker;
    map.on('click', function (e) {
      if (marker)
        map.removeLayer(marker);
      console.log(e); // e is an event object (MouseEvent in this case)
      console.log(e.latlng); // e is an event object (MouseEvent in this case)
      marker = L.marker(e.latlng).addTo(map);

      // { metStationName: "Met. Station_1", metStationCoords: { lat: 11.8166, lng: 122.0942 } },
      this.farm.metStationCoords = e.latlng;
      console.log(this.farm.metStationCoords); // e is an event object (MouseEvent in this case)
    });
  }


  addToFarm() {
    if (this.cropPestForm.invalid) { return; }

    const val: CropPest = this.cropPestForm.value;

    if (val.sowingDate) {
      val.sowingDate = new Date(val.sowingDate).toLocaleDateString('en-GB').split(",")[0];
    }

    this.elements.push({ field: val.fieldName, type: val.crop, variety: val.variety, sowing_date: val.sowingDate });
  }

  editFarm(farmId: string) {
    console.log("farm ", farmId);
    this.canEdit = !this.canEdit;

    const farmValues = this.farmForm.value;

    this.farm.name = farmValues.name;
    console.log("va", this.farm.name);
  }



}

interface CropPest {
  crop: string,
  pest: string,
  fieldName: string,
  variety: string,
  sowingDate: string
}
