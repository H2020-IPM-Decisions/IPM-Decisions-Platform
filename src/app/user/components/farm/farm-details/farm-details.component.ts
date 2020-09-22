import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.component.html',
  styleUrls: ['./farm-details.component.css']
})
export class FarmDetailsComponent implements OnInit {
  elements: any = [];
  headElements = ['field', 'type', 'variety', 'sowing_date'];

  private map: L.Map;
  @ViewChild('map', { static: false }) private mapContainer: ElementRef<HTMLElement>;

  locations: any = [
    ["Met. Station_1", 11.8166, 122.0942],
    ["Met. Station_2", 11.9804, 121.9189],
    ["Met. Station_3", 10.7202, 122.5621],
    ["Met. Station_4", 11.3889, 122.6277],
    ["Met. Station_5", 10.5929, 122.6325]
  ];

  constructor() { }

  ngOnInit() {

    for (let i = 1; i <= 7; i++) {
      this.elements.push({ field: i, type: 'Crop Type ' + i, variety: 'Crop Variety ' + i, sowing_date: 'Sowing Date ' + i });
    }   
    
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

    // many markers
    this.locations.forEach((location) => {
      L.marker([location[1], location[2]]).addTo(map).bindPopup(location[0]).openPopup();
    });
  }

}
